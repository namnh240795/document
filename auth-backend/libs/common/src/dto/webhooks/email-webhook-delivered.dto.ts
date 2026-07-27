import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailWebhookDeliveredDto {
  @ApiProperty({ description: 'Verification ID', example: 'uuid-verification-id' })
  @IsString()
  verification_id!: string;

  @ApiProperty({ description: 'Delivery status', example: 'delivered', enum: ['delivered', 'failed'] })
  @IsIn(['delivered', 'failed'])
  status!: 'delivered' | 'failed';

  @ApiProperty({ description: 'Provider message ID', example: 'sg-1234567890' })
  @IsString()
  provider_message_id!: string;

  @ApiProperty({ description: 'Error message if delivery failed', example: 'Invalid email address', required: false })
  @IsString()
  @IsOptional()
  error_message?: string;
}
