import { IsEmail, IsString, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AuthForgotPasswordDto {
  @ApiPropertyOptional({ description: 'Email address to send reset link', example: 'john@example.com' })
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  email?: string;
}

export class AuthForgotPasswordPhoneDto {
  @ApiPropertyOptional({ description: 'Phone number to send OTP', example: '+1234567890' })
  @ValidateIf((o) => !o.email)
  @IsString()
  phone?: string;
}
