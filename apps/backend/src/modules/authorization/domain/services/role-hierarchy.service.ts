import { Role } from '../entities/role.entity';
import { AuthorizationException, AUTHZ_ERROR_CODES } from '../exceptions';

export class RoleHierarchyService {
  private static readonly MAX_DEPTH = 10;

  buildInheritanceChain(role: Role, allRoles: Map<string, Role>): Role[] {
    const chain: Role[] = [role];
    const visited = new Set<string>();
    visited.add(role.getId().getValue());

    let current = role;
    while (current.getParentRoleId()) {
      const parentId = current.getParentRoleId()!.getValue();
      if (visited.has(parentId)) {
        throw new AuthorizationException(AUTHZ_ERROR_CODES.CIRCULAR_ROLE_HIERARCHY, 'Circular hierarchy');
      }
      if (chain.length > RoleHierarchyService.MAX_DEPTH) {
        throw new AuthorizationException(AUTHZ_ERROR_CODES.MAX_ROLE_DEPTH_EXCEEDED, 'Max depth exceeded');
      }

      visited.add(parentId);
      const parent = allRoles.get(parentId);
      if (!parent) break;

      chain.push(parent);
      current = parent;
    }

    return chain;
  }

  isDescendantOf(roleId: string, ancestorRoleId: string, allRoles: Map<string, Role>): boolean {
    const role = allRoles.get(roleId);
    if (!role) return false;

    let current = role;
    while (current.getParentRoleId()) {
      if (current.getParentRoleId()!.getValue() === ancestorRoleId) return true;
      const parent = allRoles.get(current.getParentRoleId()!.getValue());
      if (!parent) return false;
      current = parent;
    }

    return false;
  }

  getRootRoles(allRoles: Map<string, Role>): Role[] {
    return Array.from(allRoles.values()).filter(r => r.getParentRoleId() === null);
  }

  getLeafRoles(allRoles: Map<string, Role>): Role[] {
    const allIds = new Set(allRoles.keys());
    const parentIds = new Set<string>();

    for (const role of allRoles.values()) {
      const parentId = role.getParentRoleId();
      if (parentId) parentIds.add(parentId.getValue());
    }

    return Array.from(allRoles.values()).filter(r => !parentIds.has(r.getId().getValue()));
  }
}
