import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { Scope, AuthorizationResult, RoleAssignment } from '../types';
import { AuthorizationException, AUTHZ_ERROR_CODES } from '../exceptions';

export class RbacEngine {
  private static readonly MAX_ROLE_DEPTH = 10;

  private roles: Map<string, Role> = new Map();
  private assignments: Map<string, RoleAssignment[]> = new Map();

  registerRole(role: Role): void {
    if (role.getParentRoleId()) {
      this.validateHierarchy(role.getId().getValue(), role.getParentRoleId()!.getValue(), new Set());
    }
    this.roles.set(role.getId().getValue(), role);
  }

  unregisterRole(roleId: string): void {
    this.roles.delete(roleId);
    this.assignments.forEach((assignments, userId) => {
      this.assignments.set(
        userId,
        assignments.filter(a => a.roleId !== roleId),
      );
    });
  }

  getRole(roleId: string): Role | null {
    return this.roles.get(roleId) ?? null;
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  assignRole(userId: string, roleId: string, scope: Scope, assignedBy: string): void {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new AuthorizationException(AUTHZ_ERROR_CODES.ROLE_NOT_FOUND, `Role ${roleId} not found`);
    }

    const userAssignments = this.assignments.get(userId) ?? [];
    const alreadyAssigned = userAssignments.some(
      a => a.roleId === roleId && a.scope.type === scope.type && a.scope.referenceId === scope.referenceId,
    );
    if (alreadyAssigned) {
      throw new AuthorizationException(AUTHZ_ERROR_CODES.ROLE_ALREADY_ASSIGNED, 'Role already assigned');
    }

    userAssignments.push({
      userId,
      roleId,
      scope,
      assignedAt: new Date(),
      assignedBy,
    });
    this.assignments.set(userId, userAssignments);
  }

  removeRole(userId: string, roleId: string): void {
    const userAssignments = this.assignments.get(userId) ?? [];
    this.assignments.set(
      userId,
      userAssignments.filter(a => a.roleId !== roleId),
    );
  }

  getUserRoles(userId: string): RoleAssignment[] {
    return this.assignments.get(userId) ?? [];
  }

  getUserPermissions(userId: string, effectiveScope?: Scope): Permission[] {
    const assignments = this.getUserRoles(userId);
    const permissionMap = new Map<string, Permission>();
    const visitedRoles = new Set<string>();

    for (const assignment of assignments) {
      const role = this.roles.get(assignment.roleId);
      if (!role) continue;
      this.collectPermissions(role, permissionMap, visitedRoles, effectiveScope ?? assignment.scope);
    }

    return Array.from(permissionMap.values());
  }

  hasPermission(
    userId: string,
    resource: string,
    action: string,
    scope?: Scope,
  ): AuthorizationResult {
    const assignments = this.getUserRoles(userId);
    if (assignments.length === 0) {
      return { granted: false, effect: 'DENY', reason: 'No roles assigned', evaluatedAt: new Date() };
    }

    for (const assignment of assignments) {
      const role = this.roles.get(assignment.roleId);
      if (!role) continue;

      const visitedRoles = new Set<string>();
      const effectivePermissions = this.collectPermissions(role, new Map(), visitedRoles, scope ?? assignment.scope);

      for (const perm of effectivePermissions.values()) {
        if (perm.matches(resource, action as any)) {
          return { granted: true, effect: 'ALLOW', evaluatedAt: new Date() };
        }
      }
    }

    return { granted: false, effect: 'DENY', reason: 'Permission not found in any role', evaluatedAt: new Date() };
  }

  private collectPermissions(
    role: Role,
    acc: Map<string, Permission>,
    visited: Set<string>,
    scope: Scope,
  ): Map<string, Permission> {
    const roleId = role.getId().getValue();
    if (visited.has(roleId)) return acc;
    visited.add(roleId);

    for (const perm of role.getPermissions()) {
      const key = `${perm.getResource()}:${perm.getAction()}:${scope.type}`;
      if (!acc.has(key)) {
        acc.set(key, perm);
      }
    }

    const parentId = role.getParentRoleId();
    if (parentId) {
      const parent = this.roles.get(parentId.getValue());
      if (parent) {
        this.collectPermissions(parent, acc, visited, scope);
      }
    }

    return acc;
  }

  private validateHierarchy(roleId: string, parentRoleId: string, visited: Set<string>): void {
    if (roleId === parentRoleId) {
      throw new AuthorizationException(AUTHZ_ERROR_CODES.CIRCULAR_ROLE_HIERARCHY, 'Circular role hierarchy detected');
    }
    if (visited.has(parentRoleId)) {
      throw new AuthorizationException(AUTHZ_ERROR_CODES.CIRCULAR_ROLE_HIERARCHY, 'Circular role hierarchy detected');
    }
    visited.add(parentRoleId);

    const parent = this.roles.get(parentRoleId);
    if (!parent) return;

    if (visited.size > RbacEngine.MAX_ROLE_DEPTH) {
      throw new AuthorizationException(AUTHZ_ERROR_CODES.MAX_ROLE_DEPTH_EXCEEDED, 'Max role hierarchy depth exceeded');
    }

    const grandParent = parent.getParentRoleId();
    if (grandParent) {
      this.validateHierarchy(roleId, grandParent.getValue(), visited);
    }
  }
}
