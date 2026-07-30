import { TenantSettings, DEFAULT_TENANT_SETTINGS } from '../types';

export class TenantConfiguration {
  private readonly tenantId: string;
  private settings: TenantSettings;
  private features: Map<string, boolean>;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    tenantId: string;
    settings?: Partial<TenantSettings>;
    features?: Record<string, boolean>;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.tenantId = params.tenantId;
    this.settings = this.mergeSettings(DEFAULT_TENANT_SETTINGS, params.settings ?? {});
    this.features = new Map(Object.entries(params.features ?? {}));
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  getTenantId(): string { return this.tenantId; }
  getSettings(): TenantSettings { return { ...this.settings }; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  updateSettings(partial: Partial<TenantSettings>): void {
    this.settings = this.mergeSettings(this.settings, partial);
    this.touch();
  }

  updateBranding(branding: Partial<TenantSettings['branding']>): void {
    this.settings.branding = { ...this.settings.branding, ...branding };
    this.touch();
  }

  isFeatureEnabled(key: string): boolean {
    return this.features.get(key) ?? false;
  }

  enableFeature(key: string): void {
    this.features.set(key, true);
    this.touch();
  }

  disableFeature(key: string): void {
    this.features.set(key, false);
    this.touch();
  }

  getFeatures(): Record<string, boolean> {
    return Object.fromEntries(this.features);
  }

  private mergeSettings(base: TenantSettings, partial: Partial<TenantSettings>): TenantSettings {
    return {
      branding: { ...base.branding, ...partial.branding },
      locale: partial.locale ?? base.locale,
      timezone: partial.timezone ?? base.timezone,
      currency: partial.currency ?? base.currency,
      dateFormat: partial.dateFormat ?? base.dateFormat,
      timeFormat: partial.timeFormat ?? base.timeFormat,
      numberFormat: { ...base.numberFormat, ...partial.numberFormat },
      language: partial.language ?? base.language,
    };
  }

  private touch(): void { this.updatedAt = new Date(); }
}
