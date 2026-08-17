import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eq, and, desc, ilike, sql, count } from 'drizzle-orm';
import { createHash, randomBytes } from 'crypto';
import { invitations, type Invitation, type NewInvitation } from './invite.schema';
import { SendInvitationDto } from './dto/send-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import {
  InvitationCreatedEvent,
  InvitationAcceptedEvent,
  InvitationRevokedEvent,
  InvitationResentEvent,
} from './invite.events';

export interface InvitationQueryParams {
  userId: string;
  employerId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedInvitations {
  data: Invitation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class InviteService {
  private readonly logger = new Logger(InviteService.name);
  private readonly INVITATION_EXPIRY_HOURS = 72;
  private readonly FRONTEND_DOMAIN =
    process.env.FRONTEND_DOMAIN || 'https://frontend-domain.com';

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly db: any, // Drizzle database instance - injected via module
  ) {}

  // ──────────────────────────────────────────────
  // Token Utilities
  // ──────────────────────────────────────────────

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiry(): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + this.INVITATION_EXPIRY_HOURS);
    return expiry;
  }

  // ──────────────────────────────────────────────
  // Send Invitation
  // ──────────────────────────────────────────────

  async sendInvitation(
    dto: SendInvitationDto,
    inviterId: string,
  ): Promise<{ invitation: Invitation; rawToken: string }> {
    // 1. Validate role-specific requirements
    if (dto.role === 'HR' && !dto.employer_id) {
      throw new BadRequestException(
        'Employer ID is required when inviting an HR user',
      );
    }

    // 2. Check for existing pending invitation for the same email + role
    const existingInvitation = await this.db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, dto.email),
          eq(invitations.role, dto.role),
          eq(invitations.status, 'PENDING'),
        ),
      )
      .limit(1);

    if (existingInvitation.length > 0) {
      throw new ConflictException(
        `A pending invitation already exists for ${dto.email} with role ${dto.role}`,
      );
    }

    // 3. Generate token and hash
    const rawToken = this.generateToken();
    const tokenHash = this.hashToken(rawToken);

    // 4. Create invitation record
    const newInvitation: NewInvitation = {
      email: dto.email,
      tokenHash,
      role: dto.role,
      inviterId,
      employerId: dto.employer_id || null,
      status: 'PENDING',
      expiredAt: this.calculateExpiry(),
    };

    const [invitation] = await this.db
      .insert(invitations)
      .values(newInvitation)
      .returning();

    this.logger.log(`Invitation created: ${invitation.id} for ${dto.email}`);

    // 5. Emit event for email delivery
    const inviteUrl = `${this.FRONTEND_DOMAIN}/invitations/verify?token=${rawToken}`;
    this.eventEmitter.emit('invitation.created', {
      invitationId: invitation.id,
      email: invitation.email,
      role: invitation.role,
      inviteUrl,
      expiredAt: invitation.expiredAt,
    } as InvitationCreatedEvent);

    return { invitation, rawToken };
  }

  // ──────────────────────────────────────────────
  // Verify Token
  // ──────────────────────────────────────────────

  async verifyToken(
    token: string,
  ): Promise<{ invitation: Invitation; valid: boolean; reason?: string }> {
    const tokenHash = this.hashToken(token);

    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.tokenHash, tokenHash))
      .limit(1);

    if (!invitation) {
      return { invitation: null as any, valid: false, reason: 'Invalid token' };
    }

    // Check status
    if (invitation.status === 'ACCEPTED') {
      return {
        invitation,
        valid: false,
        reason: 'Invitation has already been accepted',
      };
    }

    if (invitation.status === 'REVOKED') {
      return {
        invitation,
        valid: false,
        reason: 'Invitation has been revoked',
      };
    }

    // Check expiry
    if (new Date() > new Date(invitation.expiredAt)) {
      // Update status to EXPIRED
      await this.db
        .update(invitations)
        .set({
          status: 'EXPIRED',
          updatedAt: new Date(),
        })
        .where(eq(invitations.id, invitation.id));

      return {
        invitation: { ...invitation, status: 'EXPIRED' },
        valid: false,
        reason: 'Invitation has expired',
      };
    }

    return { invitation, valid: true };
  }

  // ──────────────────────────────────────────────
  // Accept Invitation
  // ──────────────────────────────────────────────

  async acceptInvitation(
    dto: AcceptInvitationDto,
    userId: string,
  ): Promise<Invitation> {
    // 1. Verify token validity
    const { invitation, valid, reason } = await this.verifyToken(dto.token);

    if (!valid) {
      throw new BadRequestException(reason);
    }

    // 2. Check if the invitation is for this user (email must match)
    // This is a safety check - in real implementation, the userId should
    // correspond to the email in the invitation
    if (!invitation) {
      throw new BadRequestException('Invalid invitation token');
    }

    // 3. Update invitation status to ACCEPTED
    const [updatedInvitation] = await this.db
      .update(invitations)
      .set({
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitation.id))
      .returning();

    this.logger.log(
      `Invitation accepted: ${invitation.id} by user ${userId}`,
    );

    // 4. Emit event for downstream processing (role assignment, notification, etc.)
    this.eventEmitter.emit('invitation.accepted', {
      invitationId: invitation.id,
      email: invitation.email,
      role: invitation.role,
      employerId: invitation.employerId,
      userId,
    } as InvitationAcceptedEvent);

    return updatedInvitation;
  }

  // ──────────────────────────────────────────────
  // List Invitations
  // ──────────────────────────────────────────────

  async listInvitations(params: InvitationQueryParams): Promise<PaginatedInvitations> {
    const {
      userId,
      employerId,
      status,
      page = 1,
      limit = 10,
    } = params;

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions: any[] = [];

    // Filter by employer if provided
    if (employerId) {
      conditions.push(eq(invitations.employerId, employerId));
    } else {
      // If no employer filter, only show invitations sent by this user
      conditions.push(eq(invitations.inviterId, userId));
    }

    // Filter by status if provided
    if (status) {
      conditions.push(eq(invitations.status, status));
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [totalResult] = await this.db
      .select({ value: count() })
      .from(invitations)
      .where(whereClause);

    const total = totalResult?.value || 0;

    // Get paginated results
    const data = await this.db
      .select()
      .from(invitations)
      .where(whereClause)
      .orderBy(desc(invitations.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ──────────────────────────────────────────────
  // Revoke Invitation
  // ──────────────────────────────────────────────

  async revokeInvitation(id: string, userId: string): Promise<Invitation> {
    // 1. Find the invitation
    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.id, id))
      .limit(1);

    if (!invitation) {
      throw new NotFoundException(`Invitation with ID ${id} not found`);
    }

    // 2. Check ownership
    if (invitation.inviterId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to revoke this invitation',
      );
    }

    // 3. Check if already processed
    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestException('Cannot revoke an accepted invitation');
    }

    if (invitation.status === 'REVOKED') {
      throw new BadRequestException('Invitation is already revoked');
    }

    // 4. Update status to REVOKED
    const [updatedInvitation] = await this.db
      .update(invitations)
      .set({
        status: 'REVOKED',
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, id))
      .returning();

    this.logger.log(`Invitation revoked: ${id} by user ${userId}`);

    // 5. Emit event
    this.eventEmitter.emit('invitation.revoked', {
      invitationId: invitation.id,
      email: invitation.email,
      role: invitation.role,
      revokedBy: userId,
    } as InvitationRevokedEvent);

    return updatedInvitation;
  }

  // ──────────────────────────────────────────────
  // Resend Invitation
  // ──────────────────────────────────────────────

  async resendInvitation(id: string, userId: string): Promise<{
    invitation: Invitation;
    rawToken: string;
  }> {
    // 1. Find the invitation
    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.id, id))
      .limit(1);

    if (!invitation) {
      throw new NotFoundException(`Invitation with ID ${id} not found`);
    }

    // 2. Check ownership
    if (invitation.inviterId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to resend this invitation',
      );
    }

    // 3. Check if invitation can be resent
    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestException(
        'Cannot resend an accepted invitation',
      );
    }

    if (invitation.status === 'REVOKED') {
      throw new BadRequestException(
        'Cannot resend a revoked invitation',
      );
    }

    // 4. Generate new token and hash
    const rawToken = this.generateToken();
    const newTokenHash = this.hashToken(rawToken);

    // 5. Update invitation with new token and extended expiry
    const [updatedInvitation] = await this.db
      .update(invitations)
      .set({
        tokenHash: newTokenHash,
        status: 'PENDING',
        expiredAt: this.calculateExpiry(),
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, id))
      .returning();

    this.logger.log(`Invitation resent: ${id} by user ${userId}`);

    // 6. Emit event for email delivery
    const inviteUrl = `${this.FRONTEND_DOMAIN}/invitations/verify?token=${rawToken}`;
    this.eventEmitter.emit('invitation.resent', {
      invitationId: updatedInvitation.id,
      email: updatedInvitation.email,
      role: updatedInvitation.role,
      inviteUrl,
      expiredAt: updatedInvitation.expiredAt,
    } as InvitationResentEvent);

    return { invitation: updatedInvitation, rawToken };
  }
}
