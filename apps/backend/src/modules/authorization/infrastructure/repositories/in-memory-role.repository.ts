import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '../../application/interfaces';
import { Role } from '../../domain/entities/role.entity';

@Injectable()
export class InMemoryRoleRepository implements IRoleRepository {
  private readonly roles: Map<string, Role> = new Map();

  async save(role: Role): Promise<void> {
    this.roles.set(role.getId().getValue(), role);
  }

  async findById(id: string): Promise<Role | null> {
    return this.roles.get(id) ?? null;
  }

  async findByName(name: string): Promise<Role | null> {
    for (const role of this.roles.values()) {
      if (role.getName() === name) return role;
    }
    return null;
  }

  async findAll(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async delete(id: string): Promise<void> {
    this.roles.delete(id);
  }
}
