import { Permission } from '../entities/permission.entity';
import { Scope, AuthorizationResult } from '../types';
import { RbacEngine } from './rbac-engine.service';
import { PolicyEngine } from './policy-engine.service';

export class PermissionResolver {
  constructor(
    private readonly rbacEngine: RbacEngine,
    private readonly policyEngine: PolicyEngine,
  ) {}

  resolve(
    userId: string,
    resource: string,
    action: string,
    context: Record<string, unknown> = {},
    scope?: Scope,
  ): AuthorizationResult {
    const policyResult = this.policyEngine.evaluate(userId, resource, action, context);

    if (policyResult.effect === 'DENY') {
      return policyResult;
    }

    const rbacResult = this.rbacEngine.hasPermission(userId, resource, action, scope);

    if (!rbacResult.granted && policyResult.effect === 'ALLOW') {
      return policyResult;
    }

    return rbacResult;
  }

  resolveBatch(
    userId: string,
    requests: Array<{ resource: string; action: string; scope?: Scope }>,
    context: Record<string, unknown> = {},
  ): AuthorizationResult[] {
    return requests.map(req =>
      this.resolve(userId, req.resource, req.action, context, req.scope),
    );
  }

  getUserEffectivePermissions(userId: string, scope?: Scope): Permission[] {
    return this.rbacEngine.getUserPermissions(userId, scope);
  }
}
