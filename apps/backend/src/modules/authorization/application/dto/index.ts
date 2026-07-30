export interface CheckAccessDto {
  userId: string;
  resource: string;
  action: string;
  context?: Record<string, unknown>;
  scope?: { type: string; referenceId?: string };
}

export interface CheckAccessResultDto {
  granted: boolean;
  reason?: string;
}

export interface AssignRoleDto {
  userId: string;
  roleId: string;
  scope: { type: string; referenceId?: string };
  assignedBy: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissions?: Array<{ resource: string; action: string; scope?: { type: string } }>;
  parentRoleId?: string;
}

export interface CreatePolicyDto {
  name: string;
  description?: string;
  rules: Array<{
    effect: 'ALLOW' | 'DENY';
    resource: string;
    actions: string[];
    conditions?: Array<{ field: string; operator: string; value: unknown }>;
  }>;
  priority?: number;
}

export interface UserPermissionsDto {
  userId: string;
  permissions: Array<{
    resource: string;
    action: string;
    scope: { type: string };
  }>;
}

export interface UserRolesDto {
  userId: string;
  roles: Array<{
    roleId: string;
    roleName: string;
    scope: { type: string; referenceId?: string };
  }>;
}
