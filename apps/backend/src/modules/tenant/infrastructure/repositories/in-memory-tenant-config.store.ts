import { Injectable } from '@nestjs/common';
import { ITenantConfigStore } from '../../domain/services/settings-manager.service';
import { TenantConfiguration } from '../../domain/entities/tenant-settings.entity';

@Injectable()
export class InMemoryTenantConfigStore implements ITenantConfigStore {
  private readonly configs: Map<string, TenantConfiguration> = new Map();

  async save(config: TenantConfiguration): Promise<void> {
    this.configs.set(config.getTenantId(), config);
  }

  async findByTenantId(tenantId: string): Promise<TenantConfiguration | null> {
    return this.configs.get(tenantId) ?? null;
  }

  async delete(tenantId: string): Promise<void> {
    this.configs.delete(tenantId);
  }
}
