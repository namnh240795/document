import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SmsSendDto {
  @ApiProperty({ description: 'Recipient phone number', example: '+1234567890' })
  @IsString()
  phone!: string;

  @ApiProperty({ description: 'SMS message content', example: 'Your verification code is 123456' })
  @IsString()
  message!: string;

  @ApiProperty({ description: 'OTP code to include in SMS', example: '123456' })
  @IsString()
  otpCode!: string;

  @ApiPropertyOptional({ description: 'Associated user ID', example: 'uuid-user-id' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'OTP expiry in seconds (min 60)', example: 300, minimum: 60 })
  @IsInt()
  @Min(60)
  @IsOptional()
  expiresIn?: number;
}
