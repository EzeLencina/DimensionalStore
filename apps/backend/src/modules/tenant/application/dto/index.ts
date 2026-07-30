export interface TenantContextResponseDto {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  branchId?: string;
  branchName?: string;
  userId: string;
  userEmail: string;
  userType: string;
  locale: string;
  timezone: string;
  currency: string;
}

export interface TenantSettingsDto {
  branding: { logo?: string; primaryColor?: string; secondaryColor?: string; favicon?: string };
  locale: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
}

export interface SwitchBranchDto {
  tenantId: string;
  branchId: string;
}
