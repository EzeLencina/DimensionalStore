export type Effect = 'ALLOW' | 'DENY';

export type ScopeType = 'global' | 'organization' | 'branch' | 'department' | 'owner' | 'self' | 'custom';

export type ActionName =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'list'
  | 'export'
  | 'import'
  | 'approve'
  | 'cancel'
  | 'archive'
  | 'restore'
  | 'manage';

export interface Scope {
  type: ScopeType;
  referenceId?: string;
}

export interface Resource {
  type: string;
  id?: string;
}

export interface PermissionDefinition {
  resource: string;
  action: ActionName;
  scope?: Scope;
}

export interface RoleHierarchyEntry {
  roleId: string;
  parentRoleId: string | null;
  level: number;
}

export interface PolicyCondition {
  field: string;
  operator: 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: unknown;
}

export interface PolicyRule {
  effect: Effect;
  resource: string;
  actions: ActionName[];
  conditions?: PolicyCondition[];
  description?: string;
}

export interface AuthorizationResult {
  granted: boolean;
  effect: Effect | null;
  matchedPolicy?: string;
  reason?: string;
  evaluatedAt: Date;
}

export interface RoleAssignment {
  userId: string;
  roleId: string;
  scope: Scope;
  assignedAt: Date;
  assignedBy: string;
}
