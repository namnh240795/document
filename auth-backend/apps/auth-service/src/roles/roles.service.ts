import { Injectable, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RoleCreateDto } from '@app/common';

// In-memory store — replace with Drizzle ORM in production
const roles = new Map<string, any>();

@Injectable()
export class RolesService {
  async findAll() {
    return Array.from(roles.values());
  }

  async create(dto: RoleCreateDto) {
    // Check if role name already exists
    for (const role of roles.values()) {
      if (role.name === dto.name) {
        throw new ConflictException('Role name already exists');
      }
    }

    const role = {
      id: uuidv4(),
      name: dto.name,
      description: dto.description || null,
      permissions: dto.permissions || [],
      createdAt: new Date(),
    };

    roles.set(role.id, role);
    return role;
  }
}
