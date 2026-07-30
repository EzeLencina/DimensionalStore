import { TenantConfiguration } from '../entities/tenant-settings.entity';
import { TenantSettings, DEFAULT_TENANT_SETTINGS } from '../types';

export interface ITenantConfigStore {
  save(config: TenantConfiguration): Promise<void>;
  findByTenantId(tenantId: string): Promise<TenantConfiguration | null>;
  delete(tenantId: string): Promise<void>;
}

export class SettingsManager {
  private store: ITenantConfigStore | null = null;

  setStore(store: ITenantConfigStore): void { this.store = store; }

  async getSettings(tenantId: string): Promise<TenantSettings> {
    if (!this.store) return { ...DEFAULT_TENANT_SETTINGS };
    const config = await this.store.findByTenantId(tenantId);
    return config ? config.getSettings() : { ...DEFAULT_TENANT_SETTINGS };
  }

  async updateSettings(tenantId: string, partial: Partial<TenantSettings>): Promise<void> {
    if (!this.store) return;
    let config = await this.store.findByTenantId(tenantId);
    if (!config) {
      config = new TenantConfiguration({ tenantId });
    }
    config.updateSettings(partial);
    await this.store.save(config);
  }

  async updateBranding(tenantId: string, branding: Partial<TenantSettings['branding']>): Promise<void> {
    if (!this.store) return;
    let config = await this.store.findByTenantId(tenantId);
    if (!config) {
      config = new TenantConfiguration({ tenantId });
    }
    config.updateBranding(branding);
    await this.store.save(config);
  }

  async isFeatureEnabled(tenantId: string, key: string): Promise<boolean> {
    if (!this.store) return false;
    const config = await this.store.findByTenantId(tenantId);
    return config?.isFeatureEnabled(key) ?? false;
  }

  async enableFeature(tenantId: string, key: string): Promise<void> {
    if (!this.store) return;
    let config = await this.store.findByTenantId(tenantId);
    if (!config) {
      config = new TenantConfiguration({ tenantId });
    }
    config.enableFeature(key);
    await this.store.save(config);
  }

  async disableFeature(tenantId: string, key: string): Promise<void> {
    if (!this.store) return;
    let config = await this.store.findByTenantId(tenantId);
    if (!config) {
      config = new TenantConfiguration({ tenantId });
    }
    config.disableFeature(key);
    await this.store.save(config);
  }
}
