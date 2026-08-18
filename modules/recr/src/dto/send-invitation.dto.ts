import { IsEmail, IsNotEmpty, IsString, IsOptional, IsIn, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendInvitationDto {
  @ApiProperty({
    description: 'Email address of the invitee',
    example: 'candidate@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Role to assign to the invitee',
    enum: ['HR', 'Candidate', 'Employer'],
    example: 'HR',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['HR', 'Candidate', 'Employer'])
  role: string;

  @ApiPropertyOptional({
    description: 'Employer ID (required for HR role)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  employer_id?: string;

  @ApiPropertyOptional({
    description: 'Optional message to include in the invitation email',
    example: 'We would like to invite you to join our team.',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
