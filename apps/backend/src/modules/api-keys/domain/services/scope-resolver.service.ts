import { Scope } from '../value-objects';
import type { ServiceAccount } from '../types';

export class ScopeResolver {
  resolveForServiceAccount(account: ServiceAccount): Scope[] {
    return account.scopes.map(s => Scope.parse(s));
  }

  hasScope(accountScopes: string[], requiredScope: string): boolean {
    const required = Scope.parse(requiredScope);

    for (const s of accountScopes) {
      const accountScope = Scope.parse(s);
      if (accountScope.matches(required)) {
        return true;
      }
    }

    return false;
  }

  hasAllScopes(accountScopes: string[], requiredScopes: string[]): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const required of requiredScopes) {
      if (!this.hasScope(accountScopes, required)) {
        missing.push(required);
      }
    }

    return { valid: missing.length === 0, missing };
  }

  filterScopes(accountScopes: string[], requestedScopes: string[]): string[] {
    return requestedScopes.filter(s => this.hasScope(accountScopes, s));
  }

  matchesScope(scope: string, required: string): boolean {
    return this.hasScope([scope], required);
  }
}
