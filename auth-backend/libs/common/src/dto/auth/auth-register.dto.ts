import { IsString, IsEmail, IsOptional, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthRegisterDto {
  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'User email address', example: 'john@example.com' })
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  @ValidateIf((o) => !o.email)
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'User password (min 8 characters)', example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
