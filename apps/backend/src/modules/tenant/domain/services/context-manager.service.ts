import { TenantContext, TenantInfo, BranchInfo, TenantSettings, DEFAULT_TENANT_SETTINGS } from '../types';

export interface IContextStore {
  save(context: TenantContext): Promise<void>;
  load(userId: string, tenantId: string): Promise<TenantContext | null>;
  delete(userId: string, tenantId: string): Promise<void>;
}

export interface IBranchLookup {
  findById(branchId: string): Promise<BranchInfo | null>;
  findMainByTenantId(tenantId: string): Promise<BranchInfo | null>;
  findByTenantId(tenantId: string): Promise<BranchInfo[]>;
}

export class ContextManager {
  private store: IContextStore | null = null;
  private branchLookup: IBranchLookup | null = null;

  setStore(store: IContextStore): void { this.store = store; }
  setBranchLookup(lookup: IBranchLookup): void { this.branchLookup = lookup; }

  async buildContext(params: {
    tenant: TenantInfo;
    user: { id: string; email: string; username: string; type: string };
    branchId?: string;
    settings?: Partial<TenantSettings>;
  }): Promise<TenantContext> {
    let branch: BranchInfo | null = null;

    if (params.branchId && this.branchLookup) {
      branch = await this.branchLookup.findById(params.branchId);
    }

    if (!branch && this.branchLookup) {
      branch = await this.branchLookup.findMainByTenantId(params.tenant.id);
    }

    const context: TenantContext = {
      tenant: params.tenant,
      branch,
      user: params.user,
      settings: { ...DEFAULT_TENANT_SETTINGS, ...params.settings },
      resolvedAt: new Date(),
    };

    if (this.store) {
      await this.store.save(context);
    }

    return context;
  }

  async loadContext(userId: string, tenantId: string): Promise<TenantContext | null> {
    if (!this.store) return null;
    return this.store.load(userId, tenantId);
  }

  async clearContext(userId: string, tenantId: string): Promise<void> {
    if (this.store) {
      await this.store.delete(userId, tenantId);
    }
  }

  switchBranch(context: TenantContext, branch: BranchInfo): TenantContext {
    return {
      ...context,
      branch,
      resolvedAt: new Date(),
    };
  }
}
