import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { AUTH_CONSTANTS, SmsLog, SmsWebhookDeliveredDto } from '@app/common';

// In-memory store — replace with Drizzle ORM in production
const smsLogs = new Map<string, SmsLog>();

@Injectable()
export class SmsService {
  constructor(private readonly configService: ConfigService) {}

  // SMS FR-001: Send SMS OTP
  async sendSms(dto: {
    phone: string;
    message: string;
    otpCode: string;
    userId?: string;
    expiresIn?: number;
  }) {
    const logId = uuidv4();
    const log: SmsLog = {
      id: logId,
      userId: dto.userId || null,
      phone: dto.phone,
      message: dto.message,
      otpCode: dto.otpCode,
      status: 'pending',
      provider: 'twilio',
      providerMessageId: null,
      errorMessage: null,
      retryCount: 0,
      expiresAt: new Date(Date.now() + (dto.expiresIn || AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60) * 1000),
      sentAt: null,
      deliveredAt: null,
      createdAt: new Date(),
    };

    smsLogs.set(logId, log);

    try {
      // In production, call Twilio API:
      // const twilioClient = require('twilio')(accountSid, authToken);
      // const message = await twilioClient.messages.create({
      //   body: dto.message,
      //   to: dto.phone,
      //   from: this.configService.get('TWILIO_PHONE_NUMBER'),
      // });

      // Simulate successful send
      log.status = 'sent';
      log.providerMessageId = `SM${Date.now()}`;
      log.sentAt = new Date();

      smsLogs.set(logId, log);

      return {
        id: logId,
        status: log.status,
        providerMessageId: log.providerMessageId,
      };
    } catch (error: unknown) {
      log.status = 'failed';
      log.errorMessage = error instanceof Error ? error.message : String(error) || 'Failed to send SMS';
      smsLogs.set(logId, log);

      // Retry logic with exponential backoff (up to 3 retries)
      if (log.retryCount < 3) {
        log.retryCount += 1;
        smsLogs.set(logId, log);
        // In production: schedule retry with delay
      }

      throw new Error('SMS_SEND_FAILED');
    }
  }

  // SMS FR-002: Verify OTP
  async verifyOtp(dto: { phone: string; otpCode: string }) {
    // Find latest pending OTP for this phone
    let latestLog: SmsLog | undefined;
    for (const log of smsLogs.values()) {
      if (
        log.phone === dto.phone &&
        log.otpCode === dto.otpCode &&
        log.status === 'sent'
      ) {
        if (!latestLog || log.createdAt > latestLog.createdAt) {
          latestLog = log;
        }
      }
    }

    if (!latestLog) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Check OTP expiry (5 minutes) — SMS NFR-003
    if (latestLog.expiresAt && new Date() > latestLog.expiresAt) {
      throw new UnprocessableEntityException('OTP code has expired');
    }

    return {
      verified: true,
      userId: latestLog.userId,
    };
  }

  // SMS FR-004: Get SMS Status
  async getStatus(id: string) {
    const log = smsLogs.get(id);
    if (!log) {
      throw new NotFoundException('SMS log not found');
    }

    return {
      id: log.id,
      status: log.status,
      sentAt: log.sentAt,
      deliveredAt: log.deliveredAt,
    };
  }

  // SMS FR-003: Log SMS Delivery (Twilio Webhook)
  async handleTwilioWebhook(payload: SmsWebhookDeliveredDto) {
    const { MessageSid, MessageStatus, To, ErrorCode } = payload;

    // Find log by provider message ID
    let foundLog: SmsLog | undefined;
    for (const log of smsLogs.values()) {
      if (log.providerMessageId === MessageSid) {
        foundLog = log;
        break;
      }
    }

    if (!foundLog) {
      console.warn(`SMS log not found for MessageSid: ${MessageSid}`);
      return { success: true, message: 'Webhook processed (no matching log)' };
    }

    // Update status based on Twilio callback
    switch (MessageStatus) {
      case 'delivered':
        foundLog.status = 'delivered';
        foundLog.deliveredAt = new Date();
        break;
      case 'failed':
      case 'undelivered':
        foundLog.status = 'failed';
        foundLog.errorMessage = ErrorCode ? `Twilio Error: ${ErrorCode}` : 'Delivery failed';
        break;
      case 'sent':
        foundLog.status = 'sent';
        foundLog.sentAt = new Date();
        break;
    }

    smsLogs.set(foundLog.id, foundLog);

    // In production: notify AUTH module via HTTP webhook about delivery status
    // POST http://auth-service:3001/api/v1/webhooks/sms/delivered
    // { verification_id, status, provider_message_id, error_message }

    return { success: true, message: 'Webhook processed' };
  }
}
