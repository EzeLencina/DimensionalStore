import { RbacEngine } from './rbac-engine.service';
import { PolicyEngine } from './policy-engine.service';
import { PermissionResolver } from './permission-resolver.service';
import { RoleHierarchyService } from './role-hierarchy.service';
import { Role } from '../entities/role.entity';
import { Policy } from '../entities/policy.entity';
import { Permission } from '../entities/permission.entity';
import { Scope, AuthorizationResult, RoleAssignment } from '../types';

export class AuthorizationDomainService {
  private readonly rbacEngine: RbacEngine;
  private readonly policyEngine: PolicyEngine;
  private readonly permissionResolver: PermissionResolver;
  private readonly roleHierarchyService: RoleHierarchyService;

  constructor() {
    this.rbacEngine = new RbacEngine();
    this.policyEngine = new PolicyEngine();
    this.permissionResolver = new PermissionResolver(this.rbacEngine, this.policyEngine);
    this.roleHierarchyService = new RoleHierarchyService();
  }

  getRbacEngine(): RbacEngine { return this.rbacEngine; }
  getPolicyEngine(): PolicyEngine { return this.policyEngine; }
  getPermissionResolver(): PermissionResolver { return this.permissionResolver; }
  getRoleHierarchyService(): RoleHierarchyService { return this.roleHierarchyService; }

  checkAccess(userId: string, resource: string, action: string, context?: Record<string, unknown>, scope?: Scope): AuthorizationResult {
    return this.permissionResolver.resolve(userId, resource, action, context, scope);
  }

  checkAccessBatch(userId: string, requests: Array<{ resource: string; action: string; scope?: Scope }>, context?: Record<string, unknown>): AuthorizationResult[] {
    return this.permissionResolver.resolveBatch(userId, requests, context);
  }

  getUserPermissions(userId: string, scope?: Scope): Permission[] {
    return this.permissionResolver.getUserEffectivePermissions(userId, scope);
  }

  getUserRoles(userId: string): RoleAssignment[] {
    return this.rbacEngine.getUserRoles(userId);
  }

  assignRole(userId: string, roleId: string, scope: Scope, assignedBy: string): void {
    this.rbacEngine.assignRole(userId, roleId, scope, assignedBy);
  }

  removeRole(userId: string, roleId: string): void {
    this.rbacEngine.removeRole(userId, roleId);
  }

  createRole(role: Role): void {
    this.rbacEngine.registerRole(role);
  }

  createPolicy(policy: Policy): void {
    this.policyEngine.registerPolicy(policy);
  }

  getEffectivePermissions(userId: string, scope?: Scope): Permission[] {
    return this.rbacEngine.getUserPermissions(userId, scope);
  }
}
