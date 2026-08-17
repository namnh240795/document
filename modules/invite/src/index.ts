// Invite Module - Public API
// This barrel file exports all public types and services

// Module
export { InviteModule } from './invite.module';

// Service
export { InviteService } from './invite.service';

// Controller
export { InviteController } from './invite.controller';

// Schema
export {
  invitations,
  type Invitation,
  type NewInvitation,
} from './invite.schema';

// DTOs
export { SendInvitationDto } from './dto/send-invitation.dto';
export { AcceptInvitationDto } from './dto/accept-invitation.dto';

// Events
export {
  InvitationCreatedEvent,
  InvitationAcceptedEvent,
  InvitationRevokedEvent,
  InvitationResentEvent,
} from './invite.events';

// Consumer
export { InviteConsumer } from './invite.consumer';
