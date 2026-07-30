export type TenantResolutionStrategy = 'subdomain' | 'domain' | 'header' | 'jwt' | 'api_key' | 'path';

export interface TenantInfo {
  id: string;
  slug: string;
  name: string;
  legalName?: string;
  tradeName?: string;
  taxIdentifier?: string;
  status: string;
  tier: string;
  logo?: string;
}

export interface BranchInfo {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  status: string;
  isMain: boolean;
}

export interface TenantSettings {
  branding: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    favicon?: string;
  };
  locale: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimalSeparator: string;
    thousandsSeparator: string;
    decimalPlaces: number;
  };
  language: string;
}

export interface TenantContext {
  tenant: TenantInfo;
  branch: BranchInfo | null;
  user: {
    id: string;
    email: string;
    username: string;
    type: string;
  };
  settings: TenantSettings;
  resolvedAt: Date;
}

export interface TenantFeature {
  key: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface TenantResolutionInput {
  subdomain?: string;
  domain?: string;
  headerTenant?: string;
  jwtPayload?: Record<string, unknown>;
  pathTenant?: string;
}

export const DEFAULT_TENANT_SETTINGS: TenantSettings = {
  branding: {},
  locale: 'es_AR',
  timezone: 'America/Argentina/Buenos_Aires',
  currency: 'ARS',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
  numberFormat: {
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimalPlaces: 2,
  },
  language: 'es',
};
