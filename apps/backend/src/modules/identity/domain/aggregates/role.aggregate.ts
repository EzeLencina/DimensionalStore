import { Role } from '../entities/role.entity';

export class RoleAggregate {
  private permissionIds: string[];

  constructor(
    private readonly role: Role,
    permissionIds: string[] = [],
  ) {
    this.permissionIds = [...permissionIds];
  }

  getRole(): Role { return this.role; }
  getPermissionIds(): string[] { return [...this.permissionIds]; }

  addPermission(permissionId: string): void {
    if (!this.permissionIds.includes(permissionId)) {
      this.permissionIds.push(permissionId);
      this.role.addPermission(permissionId);
    }
  }

  removePermission(permissionId: string): void {
    this.permissionIds = this.permissionIds.filter((id) => id !== permissionId);
    this.role.removePermission(permissionId);
  }

  hasPermission(permissionId: string): boolean {
    return this.permissionIds.includes(permissionId);
  }
}
