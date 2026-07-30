import { TenantContext, TenantSettings, TenantInfo, BranchInfo } from '../../domain/types';

export interface ITenantService {
  resolveContext(userId: string, userEmail: string, username: string, userType: string, tenantId: string, branchId?: string): Promise<TenantContext>;
  getCurrentContext(userId: string, tenantId: string): Promise<TenantContext | null>;
  switchBranch(userId: string, tenantId: string, branchId: string): Promise<TenantContext>;
  getTenantSettings(tenantId: string): Promise<TenantSettings>;
  updateTenantSettings(tenantId: string, settings: Partial<TenantSettings>): Promise<void>;
  getTenantBranches(tenantId: string): Promise<BranchInfo[]>;
}
