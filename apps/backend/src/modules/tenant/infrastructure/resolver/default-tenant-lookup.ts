import { Injectable } from '@nestjs/common';
import { ITenantLookup } from '../../domain/services/tenant-resolver.service';
import { TenantInfo } from '../../domain/types';

@Injectable()
export class DefaultTenantLookup implements ITenantLookup {
  private tenants: Map<string, TenantInfo> = new Map();

  register(tenant: TenantInfo): void {
    this.tenants.set(tenant.id, tenant);
  }

  async findBySlug(slug: string): Promise<TenantInfo | null> {
    for (const tenant of this.tenants.values()) {
      if (tenant.slug === slug) return tenant;
    }
    return null;
  }

  async findByDomain(_domain: string): Promise<TenantInfo | null> {
    return null;
  }

  async findById(id: string): Promise<TenantInfo | null> {
    return this.tenants.get(id) ?? null;
  }
}
