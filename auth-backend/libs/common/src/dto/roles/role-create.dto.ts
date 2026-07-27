import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleCreateDto {
  @ApiProperty({ description: 'Role name', example: 'admin' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Role description', example: 'Administrator role' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Role permissions', example: ['users:read', 'users:write'], type: [String] })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}
