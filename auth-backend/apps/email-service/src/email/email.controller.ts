import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { EmailWebhookDeliveredDto } from '@app/common';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('webhooks/email/delivered')
  @ApiOperation({ summary: 'Email delivery status webhook' })
  async handleWebhook(
    @Body() payload: EmailWebhookDeliveredDto,
    @Headers('x-webhook-signature') signature: string,
  ) {
    return this.emailService.handleDeliveryWebhook(payload, signature);
  }
}
