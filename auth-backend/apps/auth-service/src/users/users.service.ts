import { Injectable, NotFoundException } from '@nestjs/common';
import { UserUpdateDto } from '@app/common';

// In-memory store — replace with Drizzle ORM in production
const users = new Map<string, any>();
const userRoles = new Map<string, any>();

@Injectable()
export class UsersService {
  async findAll(page: number = 1, limit: number = 20, search?: string) {
    let userList = Array.from(users.values());

    if (search) {
      const searchLower = search.toLowerCase();
      userList = userList.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower) ||
          u.phone?.includes(search),
      );
    }

    const total = userList.length;
    const offset = (page - 1) * limit;
    const paginatedUsers = userList.slice(offset, offset + limit);

    return {
      users: paginatedUsers.map(({ passwordHash, ...user }) => user),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async update(id: string, dto: UserUpdateDto) {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = {
      ...user,
      ...dto,
      updatedAt: new Date(),
    };

    users.set(id, updatedUser);

    const { passwordHash, ...result } = updatedUser;
    return result;
  }

  async remove(id: string) {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    users.delete(id);
    return { success: true, message: 'User deleted successfully' };
  }

  async assignRole(userId: string, roleId: string) {
    const user = users.get(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const key = `${userId}-${roleId}`;
    userRoles.set(key, {
      userId,
      roleId,
      assignedAt: new Date(),
    });

    return { success: true, message: 'Role assigned successfully' };
  }
}
