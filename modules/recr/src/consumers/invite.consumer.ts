import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  InvitationCreatedEvent,
  InvitationAcceptedEvent,
  InvitationRevokedEvent,
  InvitationResentEvent,
} from '../events/invite.events';

/**
 * InviteConsumer
 *
 * Handles events emitted by InviteService for downstream processing.
 * In a microservices architecture, these events would be published
 * to RabbitMQ queues for async processing by the email/notification worker.
 *
 * Event Flow:
 * invitation.created -> Email worker -> Send invitation email
 * invitation.accepted -> Auth worker -> Assign role, create user if needed
 * invitation.revoked -> Email worker -> Send revocation notification
 * invitation.resent -> Email worker -> Send new invitation email
 */
@Injectable()
export class InviteConsumer {
  private readonly logger = new Logger(InviteConsumer.name);

  constructor() {}

  // ──────────────────────────────────────────────
  // invitation.created
  // ──────────────────────────────────────────────

  @OnEvent('invitation.created')
  async handleInvitationCreated(event: InvitationCreatedEvent): Promise<void> {
    this.logger.log(
      `Processing invitation.created event for ${event.email}`,
    );

    try {
      // In production, this would:
      // 1. Publish to RabbitMQ queue for email worker
      // 2. Email worker sends invitation email with inviteUrl
      // 3. Track email delivery status

      this.logger.log(
        `Invitation email queued for ${event.email} ` +
        `(role: ${event.role}, expires: ${event.expiredAt})`,
      );

      // TODO: Integrate with EMAIL module via RabbitMQ
      // await this.rabbitMQClient.emit('email.send', {
      //   to: event.email,
      //   template: 'invitation',
      //   data: {
      //     inviteUrl: event.inviteUrl,
      //     role: event.role,
      //     expiredAt: event.expiredAt,
      //   },
      // });
    } catch (error) {
      this.logger.error(
        `Failed to process invitation.created for ${event.email}`,
        error.stack,
      );
    }
  }

  // ──────────────────────────────────────────────
  // invitation.accepted
  // ──────────────────────────────────────────────

  @OnEvent('invitation.accepted')
  async handleInvitationAccepted(event: InvitationAcceptedEvent): Promise<void> {
    this.logger.log(
      `Processing invitation.accepted event for ${event.email}`,
    );

    try {
      // In production, this would:
      // 1. Publish to RabbitMQ queue for auth worker
      // 2. Auth worker assigns role to user
      // 3. If user doesn't exist, create user account
      // 4. Send welcome email notification

      this.logger.log(
        `User ${event.userId} accepted invitation ` +
        `(email: ${event.email}, role: ${event.role}, ` +
        `employer: ${event.employerId || 'N/A'})`,
      );

      // TODO: Integrate with AUTH module via RabbitMQ
      // await this.rabbitMQClient.emit('auth.assign-role', {
      //   userId: event.userId,
      //   role: event.role,
      //   employerId: event.employerId,
      // });

      // TODO: Send welcome notification
      // await this.rabbitMQClient.emit('notification.send', {
      //   userId: event.userId,
      //   type: 'WELCOME',
      //   data: { role: event.role },
      // });
    } catch (error) {
      this.logger.error(
        `Failed to process invitation.accepted for ${event.email}`,
        error.stack,
      );
    }
  }

  // ──────────────────────────────────────────────
  // invitation.revoked
  // ──────────────────────────────────────────────

  @OnEvent('invitation.revoked')
  async handleInvitationRevoked(event: InvitationRevokedEvent): Promise<void> {
    this.logger.log(
      `Processing invitation.revoked event for ${event.email}`,
    );

    try {
      // In production, this would:
      // 1. Send revocation notification email to invitee
      // 2. Log audit trail for compliance

      this.logger.log(
        `Invitation revoked for ${event.email} ` +
        `(role: ${event.role}, revoked by: ${event.revokedBy})`,
      );

      // TODO: Send revocation notification
      // await this.rabbitMQClient.emit('notification.send', {
      //   to: event.email,
      //   type: 'INVITATION_REVOKED',
      //   data: { role: event.role },
      // });
    } catch (error) {
      this.logger.error(
        `Failed to process invitation.revoked for ${event.email}`,
        error.stack,
      );
    }
  }

  // ──────────────────────────────────────────────
  // invitation.resent
  // ──────────────────────────────────────────────

  @OnEvent('invitation.resent')
  async handleInvitationResent(event: InvitationResentEvent): Promise<void> {
    this.logger.log(
      `Processing invitation.resent event for ${event.email}`,
    );

    try {
      // In production, this would:
      // 1. Publish to RabbitMQ queue for email worker
      // 2. Email worker sends new invitation email
      // 3. Track email delivery status

      this.logger.log(
        `Resent invitation email queued for ${event.email} ` +
        `(role: ${event.role}, expires: ${event.expiredAt})`,
      );

      // TODO: Integrate with EMAIL module via RabbitMQ
      // await this.rabbitMQClient.emit('email.send', {
      //   to: event.email,
      //   template: 'invitation-resent',
      //   data: {
      //     inviteUrl: event.inviteUrl,
      //     role: event.role,
      //     expiredAt: event.expiredAt,
      //   },
      // });
    } catch (error) {
      this.logger.error(
        `Failed to process invitation.resent for ${event.email}`,
        error.stack,
      );
    }
  }
}
