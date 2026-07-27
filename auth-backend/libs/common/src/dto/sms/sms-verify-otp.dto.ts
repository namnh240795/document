import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SmsVerifyOtpDto {
  @ApiProperty({ description: 'Phone number to verify', example: '+1234567890' })
  @IsString()
  phone!: string;

  @ApiProperty({ description: '6-digit OTP code', example: '123456', minLength: 6, maxLength: 6 })
  @IsString()
  @Length(6, 6)
  otpCode!: string;
}
