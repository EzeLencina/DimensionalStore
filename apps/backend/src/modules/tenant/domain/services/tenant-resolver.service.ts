import { TenantInfo, TenantResolutionInput, TenantResolutionStrategy } from '../types';

export interface ITenantLookup {
  findBySlug(slug: string): Promise<TenantInfo | null>;
  findByDomain(domain: string): Promise<TenantInfo | null>;
  findById(id: string): Promise<TenantInfo | null>;
}

export class TenantResolver {
  private strategy: TenantResolutionStrategy = 'header';
  private lookup: ITenantLookup | null = null;

  setStrategy(strategy: TenantResolutionStrategy): void {
    this.strategy = strategy;
  }

  setLookup(lookup: ITenantLookup): void {
    this.lookup = lookup;
  }

  getStrategy(): TenantResolutionStrategy {
    return this.strategy;
  }

  async resolve(input: TenantResolutionInput): Promise<TenantInfo | null> {
    if (!this.lookup) return null;

    switch (this.strategy) {
      case 'subdomain':
        if (input.subdomain) return this.lookup.findBySlug(input.subdomain);
        return null;

      case 'domain':
        if (input.domain) return this.lookup.findByDomain(input.domain);
        return null;

      case 'header':
        if (input.headerTenant) {
          const byId = await this.lookup.findById(input.headerTenant);
          if (byId) return byId;
          return this.lookup.findBySlug(input.headerTenant);
        }
        return null;

      case 'jwt':
        if (input.jwtPayload) {
          const tenantId = input.jwtPayload['tenantId'] as string;
          const tenantSlug = input.jwtPayload['tenantSlug'] as string;
          if (tenantId) return this.lookup.findById(tenantId);
          if (tenantSlug) return this.lookup.findBySlug(tenantSlug);
        }
        return null;

      case 'path':
        if (input.pathTenant) {
          const byId = await this.lookup.findById(input.pathTenant);
          if (byId) return byId;
          return this.lookup.findBySlug(input.pathTenant);
        }
        return null;

      case 'api_key':
        return null;

      default:
        return null;
    }
  }
}
