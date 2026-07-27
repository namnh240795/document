import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyHmacSignature, SmsWebhookDeliveredDto, EmailWebhookDeliveredDto } from '@app/common';

@Injectable()
export class WebhooksService {
  async handleSmsDelivery(payload: SmsWebhookDeliveredDto) {
    const { MessageSid, MessageStatus, To, ErrorCode } = payload;

    console.log(`SMS Delivery: ${MessageSid} - ${MessageStatus} for ${To}`);

    if (ErrorCode) {
      console.error(`SMS Error: ${ErrorCode}`);
    }

    return { success: true, message: 'Webhook processed' };
  }

  async handleEmailDelivery(payload: EmailWebhookDeliveredDto, signature: string) {
    const webhookSecret = process.env.WEBHOOK_SECRET || 'default-webhook-secret';
    const body = JSON.stringify(payload);

    if (!verifyHmacSignature(body, signature, webhookSecret)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const { verification_id, status, error_message } = payload;

    console.log(`Email Delivery: ${verification_id} - ${status}`);

    if (error_message) {
      console.error(`Email Error: ${error_message}`);
    }

    return { success: true, message: 'Webhook processed' };
  }
}
