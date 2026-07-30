import { Role, Permission, Policy } from '../../domain/entities';
import { Scope, AuthorizationResult, RoleAssignment } from '../../domain/types';

export interface IAuthorizationService {
  checkAccess(userId: string, resource: string, action: string, context?: Record<string, unknown>, scope?: Scope): Promise<AuthorizationResult>;
  checkAccessBatch(userId: string, requests: Array<{ resource: string; action: string; scope?: Scope }>, context?: Record<string, unknown>): Promise<AuthorizationResult[]>;
  getUserPermissions(userId: string, scope?: Scope): Promise<Permission[]>;
  getUserRoles(userId: string): Promise<RoleAssignment[]>;
  assignRole(userId: string, roleId: string, scope: Scope, assignedBy: string): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
  createRole(role: Role): Promise<void>;
  createPolicy(policy: Policy): Promise<void>;
}
