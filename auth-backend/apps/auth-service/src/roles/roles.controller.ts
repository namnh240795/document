import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard, AdminGuard, RoleCreateDto } from '@app/common';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new role' })
  async create(@Body() dto: RoleCreateDto) {
    return this.rolesService.create(dto);
  }
}
