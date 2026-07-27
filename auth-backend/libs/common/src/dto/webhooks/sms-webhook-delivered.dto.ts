import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SmsWebhookDeliveredDto {
  @ApiProperty({ description: 'Twilio message SID', example: 'SM1234567890abcdef' })
  @IsString()
  MessageSid!: string;

  @ApiProperty({ description: 'Message delivery status', example: 'delivered', enum: ['sent', 'delivered', 'failed'] })
  @IsString()
  MessageStatus!: string;

  @ApiProperty({ description: 'Recipient phone number', example: '+1234567890' })
  @IsString()
  To!: string;

  @ApiPropertyOptional({ description: 'Error code if delivery failed', example: '30003' })
  @IsString()
  @IsOptional()
  ErrorCode?: string;

  @ApiPropertyOptional({ description: 'Sender phone number', example: '+0987654321' })
  @IsString()
  @IsOptional()
  From?: string;

  @ApiPropertyOptional({ description: 'Message body', example: 'Your code is 123456' })
  @IsString()
  @IsOptional()
  Body?: string;
}
