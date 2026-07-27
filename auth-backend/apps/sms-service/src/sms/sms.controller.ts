import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { SmsSendDto, SmsVerifyOtpDto, SmsWebhookDeliveredDto } from '@app/common';

@ApiTags('sms')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send SMS OTP' })
  async send(@Body() dto: SmsSendDto) {
    return this.smsService.sendSms(dto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP code' })
  async verify(@Body() dto: SmsVerifyOtpDto) {
    return this.smsService.verifyOtp(dto);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get SMS delivery status' })
  async getStatus(@Param('id') id: string) {
    return this.smsService.getStatus(id);
  }

  @Post('webhooks/sms/delivered')
  @ApiOperation({ summary: 'Twilio delivery status webhook' })
  async handleWebhook(@Body() payload: SmsWebhookDeliveredDto) {
    return this.smsService.handleTwilioWebhook(payload);
  }
}
