import { RoleId } from '../value-objects/role-id.value-object';
import { Permission } from './permission.entity';
import { Scope } from '../types';

export class Role {
  private readonly id: RoleId;
  private name: string;
  private description: string;
  private permissions: Permission[];
  private parentRoleId: RoleId | null;
  private readonly level: number;
  private isSystem: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id?: RoleId;
    name: string;
    description?: string;
    permissions?: Permission[];
    parentRoleId?: RoleId | null;
    level?: number;
    isSystem?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? new RoleId();
    this.name = params.name;
    this.description = params.description ?? '';
    this.permissions = params.permissions ?? [];
    this.parentRoleId = params.parentRoleId ?? null;
    this.level = params.level ?? 0;
    this.isSystem = params.isSystem ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  getId(): RoleId { return this.id; }
  getName(): string { return this.name; }
  getDescription(): string { return this.description; }
  getPermissions(): Permission[] { return [...this.permissions]; }
  getParentRoleId(): RoleId | null { return this.parentRoleId; }
  getLevel(): number { return this.level; }
  isSystemRole(): boolean { return this.isSystem; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  setName(name: string): void { this.name = name; this.touch(); }
  setDescription(description: string): void { this.description = description; this.touch(); }
  setParentRoleId(parentRoleId: RoleId | null): void { this.parentRoleId = parentRoleId; this.touch(); }

  addPermission(permission: Permission): void {
    const exists = this.permissions.some(p => p.matches(permission.getResource(), permission.getAction()));
    if (!exists) {
      this.permissions.push(permission);
      this.touch();
    }
  }

  removePermission(resource: string, action: string): void {
    this.permissions = this.permissions.filter(p => !p.matches(resource, action as any));
    this.touch();
  }

  hasPermission(resource: string, action: string, scope?: Scope): boolean {
    return this.permissions.some(p =>
      p.matches(resource, action as any) &&
      (!scope || p.getScope().type === scope.type),
    );
  }

  private touch(): void { this.updatedAt = new Date(); }
}
