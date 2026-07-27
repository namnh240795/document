import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAssignRoleDto {
  @ApiProperty({ description: 'Role ID to assign', example: 'uuid-role-id' })
  @IsString()
  roleId!: string;
}
