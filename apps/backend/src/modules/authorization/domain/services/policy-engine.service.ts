import { Policy } from '../entities/policy.entity';
import { Effect, AuthorizationResult, PolicyRule, PolicyCondition } from '../types';

export class PolicyEngine {
  private policies: Policy[] = [];

  registerPolicy(policy: Policy): void {
    this.policies.push(policy);
    this.policies.sort((a, b) => b.getPriority() - a.getPriority());
  }

  unregisterPolicy(policyId: string): void {
    this.policies = this.policies.filter(p => p.getId().getValue() !== policyId);
  }

  getPolicy(policyId: string): Policy | null {
    return this.policies.find(p => p.getId().getValue() === policyId) ?? null;
  }

  getAllPolicies(): Policy[] {
    return [...this.policies];
  }

  evaluate(
    userId: string,
    resource: string,
    action: string,
    context: Record<string, unknown> = {},
  ): AuthorizationResult {
    for (const policy of this.policies) {
      if (!policy.isEnabled()) continue;

      for (const rule of policy.getRules()) {
        if (!this.matchesResource(rule, resource)) continue;
        if (!this.matchesAction(rule, action)) continue;
        if (!this.evaluateConditions(rule, context)) continue;

        return {
          granted: rule.effect === 'ALLOW',
          effect: rule.effect,
          matchedPolicy: policy.getName(),
          evaluatedAt: new Date(),
        };
      }
    }

    return { granted: false, effect: 'DENY', reason: 'No matching policy rule', evaluatedAt: new Date() };
  }

  private matchesResource(rule: PolicyRule, resource: string): boolean {
    if (rule.resource === '*') return true;
    if (rule.resource.endsWith('*')) {
      return resource.startsWith(rule.resource.slice(0, -1));
    }
    return rule.resource === resource;
  }

  private matchesAction(rule: PolicyRule, action: string): boolean {
    return rule.actions.some(a => a === action || a === 'manage' as any);
  }

  private evaluateConditions(rule: PolicyRule, context: Record<string, unknown>): boolean {
    if (!rule.conditions || rule.conditions.length === 0) return true;

    return rule.conditions.every(condition => this.evaluateCondition(condition, context));
  }

  private evaluateCondition(condition: PolicyCondition, context: Record<string, unknown>): boolean {
    const contextValue = context[condition.field];

    switch (condition.operator) {
      case 'eq': return contextValue === condition.value;
      case 'neq': return contextValue !== condition.value;
      case 'in': return Array.isArray(condition.value) && condition.value.includes(contextValue);
      case 'nin': return Array.isArray(condition.value) && !condition.value.includes(contextValue);
      case 'gt': return typeof contextValue === 'number' && typeof condition.value === 'number' && contextValue > condition.value;
      case 'gte': return typeof contextValue === 'number' && typeof condition.value === 'number' && contextValue >= condition.value;
      case 'lt': return typeof contextValue === 'number' && typeof condition.value === 'number' && contextValue < condition.value;
      case 'lte': return typeof contextValue === 'number' && typeof condition.value === 'number' && contextValue <= condition.value;
      case 'contains': return typeof contextValue === 'string' && typeof condition.value === 'string' && contextValue.includes(condition.value);
      case 'startsWith': return typeof contextValue === 'string' && typeof condition.value === 'string' && contextValue.startsWith(condition.value);
      case 'endsWith': return typeof contextValue === 'string' && typeof condition.value === 'string' && contextValue.endsWith(condition.value);
      default: return false;
    }
  }
}
