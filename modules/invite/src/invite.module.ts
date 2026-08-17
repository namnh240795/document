import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { InviteConsumer } from './invite.consumer';

/**
 * InviteModule
 *
 * Handles invitation lifecycle:
 * - Sending invitations to candidates/HR/Employers
 * - Token verification and acceptance
 * - List, revoke, and resend operations
 *
 * Integrations:
 * - RabbitMQ via EventEmitter2 for async event processing
 * - Email module (via events) for invitation delivery
 * - Auth module for user creation upon acceptance
 * - Organization/Team module for role assignment
 *
 * Environment Variables:
 * - RABBITMQ_URL: RabbitMQ connection URL (default: amqp://localhost:5672)
 * - FRONTEND_DOMAIN: Frontend URL for invitation links (default: https://frontend-domain.com)
 */
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // RabbitMQ client for inter-service communication
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'invite_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [InviteController],
  providers: [
    InviteService,
    InviteConsumer,
    {
      provide: 'DRIZZLE_DB',
      useFactory: () => {
        // Database connection should be injected via the main app module
        // using DRIZZLE_DB token. Configure in app.module.ts:
        //
        // @Module({
        //   imports: [InviteModule],
        //   providers: [
        //     {
        //       provide: 'DRIZZLE_DB',
        //       useFactory: (drizzleService: DrizzleService) => drizzleService.db,
        //       inject: [DrizzleService],
        //     },
        //   ],
        // })
        return null;
      },
    },
  ],
  exports: [InviteService],
})
export class InviteModule {}

// Re-export types and schema for other modules
export { invitations, type Invitation, type NewInvitation } from './invite.schema';
export { SendInvitationDto } from './dto/send-invitation.dto';
export { AcceptInvitationDto } from './dto/accept-invitation.dto';
export {
  InvitationCreatedEvent,
  InvitationAcceptedEvent,
  InvitationRevokedEvent,
  InvitationResentEvent,
} from './invite.events';
