import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthVerifyEmailQueryDto {
  @ApiProperty({ description: 'Email verification token', example: 'abc123XYZ' })
  @IsString()
  @MinLength(1)
  token!: string;
}
