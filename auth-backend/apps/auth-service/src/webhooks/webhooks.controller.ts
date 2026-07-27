import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { SmsWebhookDeliveredDto, EmailWebhookDeliveredDto } from '@app/common';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('sms/delivered')
  @ApiOperation({ summary: 'SMS delivery status webhook' })
  async handleSmsWebhook(@Body() payload: SmsWebhookDeliveredDto) {
    return this.webhooksService.handleSmsDelivery(payload);
  }

  @Post('email/delivered')
  @ApiOperation({ summary: 'Email delivery status webhook' })
  async handleEmailWebhook(
    @Body() payload: EmailWebhookDeliveredDto,
    @Headers('x-webhook-signature') signature: string,
  ) {
    return this.webhooksService.handleEmailDelivery(payload, signature);
  }
}
