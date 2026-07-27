import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ description: 'Email or phone number', example: 'john@example.com' })
  @IsString()
  identifier!: string;

  @ApiProperty({ description: 'User password', example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
