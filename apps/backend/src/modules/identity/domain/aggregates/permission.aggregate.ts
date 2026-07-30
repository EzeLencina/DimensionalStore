import { Permission } from '../entities/permission.entity';

export class PermissionAggregate {
  constructor(private readonly permission: Permission) {}

  getPermission(): Permission { return this.permission; }
}
