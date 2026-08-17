import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { InviteService } from './invite.service';
import { SendInvitationDto } from './dto/send-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@ApiTags('Invitations')
@Controller('invitations')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  // ──────────────────────────────────────────────
  // POST /invitations/send
  // ──────────────────────────────────────────────

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a new invitation' })
  @ApiResponse({
    status: 201,
    description: 'Invitation sent successfully',
    schema: {
      example: {
        invitation: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'candidate@example.com',
          role: 'HR',
          status: 'PENDING',
          expiredAt: '2026-08-20T12:00:00.000Z',
        },
        message: 'Invitation sent successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Pending invitation already exists' })
  @ApiBearerAuth()
  async sendInvitation(
    @Body() dto: SendInvitationDto,
    @Req() req: any,
  ) {
    const { invitation } = await this.inviteService.sendInvitation(
      dto,
      req.user.id,
    );

    return {
      invitation,
      message: 'Invitation sent successfully',
    };
  }

  // ──────────────────────────────────────────────
  // GET /invitations/verify
  // ──────────────────────────────────────────────

  @Get('verify')
  @ApiOperation({ summary: 'Verify invitation token validity' })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Invitation token to verify',
  })
  @ApiResponse({
    status: 200,
    description: 'Token verification result',
    schema: {
      example: {
        valid: true,
        invitation: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'candidate@example.com',
          role: 'HR',
          status: 'PENDING',
          expiredAt: '2026-08-20T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyToken(@Query('token') token: string) {
    const result = await this.inviteService.verifyToken(token);

    return {
      valid: result.valid,
      invitation: result.invitation,
      reason: result.reason,
    };
  }

  // ──────────────────────────────────────────────
  // POST /invitations/accept
  // ──────────────────────────────────────────────

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept an invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully',
    schema: {
      example: {
        invitation: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'candidate@example.com',
          role: 'HR',
          status: 'ACCEPTED',
          acceptedAt: '2026-08-17T10:00:00.000Z',
        },
        message: 'Invitation accepted successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiBearerAuth()
  async acceptInvitation(
    @Body() dto: AcceptInvitationDto,
    @Req() req: any,
  ) {
    const invitation = await this.inviteService.acceptInvitation(
      dto,
      req.user.id,
    );

    return {
      invitation,
      message: 'Invitation accepted successfully',
    };
  }

  // ──────────────────────────────────────────────
  // GET /invitations
  // ──────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List invitations with filters' })
  @ApiQuery({ name: 'employer_id', required: false, description: 'Filter by employer ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (PENDING, ACCEPTED, REVOKED, EXPIRED)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of invitations with pagination',
  })
  @ApiBearerAuth()
  async listInvitations(
    @Req() req: any,
    @Query('employer_id') employerId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inviteService.listInvitations({
      userId: req.user.id,
      employerId,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  // ──────────────────────────────────────────────
  // DELETE /invitations/:id
  // ──────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke/cancel an invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation revoked successfully',
    schema: {
      example: {
        invitation: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'REVOKED',
        },
        message: 'Invitation revoked successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({ status: 403, description: 'Not invitation owner' })
  @ApiBearerAuth()
  async revokeInvitation(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    const invitation = await this.inviteService.revokeInvitation(
      id,
      req.user.id,
    );

    return {
      invitation,
      message: 'Invitation revoked successfully',
    };
  }

  // ──────────────────────────────────────────────
  // POST /invitations/:id/resend
  // ──────────────────────────────────────────────

  @Post(':id/resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend an invitation with a new token' })
  @ApiResponse({
    status: 200,
    description: 'Invitation resent successfully',
    schema: {
      example: {
        invitation: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'candidate@example.com',
          status: 'PENDING',
          expiredAt: '2026-08-20T12:00:00.000Z',
        },
        message: 'Invitation resent successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({ status: 403, description: 'Not invitation owner' })
  @ApiBearerAuth()
  async resendInvitation(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    const { invitation } = await this.inviteService.resendInvitation(
      id,
      req.user.id,
    );

    return {
      invitation,
      message: 'Invitation resent successfully',
    };
  }
}
