import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { verifyHmacSignature, EmailLog, EmailWebhookDeliveredDto } from '@app/common';

// In-memory store — replace with Drizzle ORM in production
const emailLogs = new Map<string, EmailLog>();

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  // EMAIL FR-001: Send Verification Email
  async sendVerificationEmail(dto: {
    userId: string;
    email: string;
    otp: string;
    verificationId: string;
  }) {
    const logId = uuidv4();
    const log: EmailLog = {
      id: logId,
      userId: dto.userId,
      email: dto.email,
      subject: 'Verify your email address',
      templateId: 'email-verification',
      status: 'pending',
      provider: 'sendgrid',
      providerMessageId: null,
      errorMessage: null,
      retryCount: 0,
      metadata: { otp: dto.otp, verificationId: dto.verificationId },
      sentAt: null,
      deliveredAt: null,
      createdAt: new Date(),
    };

    emailLogs.set(logId, log);

    try {
      // In production, call SendGrid API:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
      // await sgMail.send({
      //   to: dto.email,
      //   from: this.configService.get('SENDGRID_FROM_EMAIL'),
      //   subject: 'Verify your email address',
      //   html: `<p>Your verification code is: <strong>${dto.otp}</strong></p>`,
      // });

      // Simulate successful send
      log.status = 'sent';
      log.providerMessageId = `sg-${Date.now()}`;
      log.sentAt = new Date();

      emailLogs.set(logId, log);

      return {
        id: logId,
        status: log.status,
        providerMessageId: log.providerMessageId,
      };
    } catch (error: unknown) {
      log.status = 'failed';
      log.errorMessage = error instanceof Error ? error.message : String(error) || 'Failed to send email';
      emailLogs.set(logId, log);

      throw new Error('EMAIL_003');
    }
  }

  // EMAIL FR-003: Track Email Delivery (Webhook)
  async handleDeliveryWebhook(payload: EmailWebhookDeliveredDto, signature: string) {
    // Verify HMAC-SHA256 signature — EMAIL TDS Section 6
    const webhookSecret = this.configService.get('WEBHOOK_SECRET', 'default-webhook-secret');
    const body = JSON.stringify(payload);

    if (!verifyHmacSignature(body, signature, webhookSecret)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const { verification_id, status, error_message } = payload;

    // Find log by verification ID
    let foundLog: EmailLog | undefined;
    for (const log of emailLogs.values()) {
      if (log.metadata && (log.metadata as Record<string, unknown>).verificationId === verification_id) {
        foundLog = log;
        break;
      }
    }

    if (!foundLog) {
      console.warn(`Email log not found for verification_id: ${verification_id}`);
      return { success: true, message: 'Webhook processed (no matching log)' };
    }

    // Update status
    if (status === 'delivered') {
      foundLog.status = 'delivered';
      foundLog.deliveredAt = new Date();
    } else if (status === 'failed') {
      foundLog.status = 'failed';
      foundLog.errorMessage = error_message || 'Delivery failed';
    }

    emailLogs.set(foundLog.id, foundLog);

    // In production: notify AUTH module via HTTP webhook about delivery status
    // POST http://auth-service:3001/api/v1/webhooks/email/delivered

    return { success: true, message: 'Webhook processed' };
  }

  // EMAIL FR-005: Retry Failed Emails (runs every 5 minutes)
  async retryFailedEmails() {
    const failedEmails = Array.from(emailLogs.values()).filter(
      (log) => log.status === 'failed' && log.retryCount < 3,
    );

    for (const log of failedEmails) {
      log.retryCount += 1;
      log.status = 'pending';
      emailLogs.set(log.id, log);

      // In production: re-queue to RabbitMQ for retry
      // The retry delay increases exponentially: 1min, 5min, 15min
      console.log(`Retrying email ${log.id} (attempt ${log.retryCount})`);
    }

    return {
      success: true,
      retriedCount: failedEmails.length,
    };
  }
}
