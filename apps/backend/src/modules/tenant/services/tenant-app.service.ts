import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '@core/cache/redis';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { ITenantService } from '../application/interfaces';
import { TenantResolver, ContextManager, TenantValidator, SettingsManager, ITenantLookup, IContextStore, IBranchLookup, ITenantConfigStore } from '../domain/services';
import { RedisContextStore } from '../infrastructure/context';
import { DefaultTenantLookup } from '../infrastructure/resolver';
import { InMemoryTenantConfigStore } from '../infrastructure/repositories';
import { TenantContext, TenantSettings, TenantInfo, BranchInfo, DEFAULT_TENANT_SETTINGS } from '../domain/types';
import { TenantConfiguration } from '../domain/entities/tenant-settings.entity';
import { TenantException, TENANT_ERROR_CODES } from '../domain/exceptions';

@Injectable()
export class TenantAppService implements ITenantService {
  private readonly resolver: TenantResolver;
  private readonly contextManager: ContextManager;
  private readonly validator: TenantValidator;
  private readonly settingsManager: SettingsManager;

  constructor(
    @Inject(RedisService) private readonly redis: RedisService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {
    this.resolver = new TenantResolver();
    this.contextManager = new ContextManager();
    this.validator = new TenantValidator();
    this.settingsManager = new SettingsManager();

    const lookup = new DefaultTenantLookup();
    this.resolver.setLookup(lookup);
    this.resolver.setStrategy('header');

    const store: IContextStore = new RedisContextStore(this.redis);
    this.contextManager.setStore(store);
    this.contextManager.setBranchLookup(lookup as unknown as IBranchLookup);

    const configStore: ITenantConfigStore = new InMemoryTenantConfigStore();
    this.settingsManager.setStore(configStore);
  }

  getResolver(): TenantResolver { return this.resolver; }
  getContextManager(): ContextManager { return this.contextManager; }
  getValidator(): TenantValidator { return this.validator; }
  getSettingsManager(): SettingsManager { return this.settingsManager; }

  async resolveContext(
    userId: string,
    userEmail: string,
    username: string,
    userType: string,
    tenantId: string,
    branchId?: string,
  ): Promise<TenantContext> {
    const tenant = await this.resolver.resolve({
      headerTenant: tenantId,
    });

    if (!tenant) {
      throw new TenantException(TENANT_ERROR_CODES.TENANT_NOT_FOUND, `Tenant ${tenantId} not found`);
    }

    let settings = await this.settingsManager.getSettings(tenant.id);
    if (!settings) {
      settings = DEFAULT_TENANT_SETTINGS;
    }

    const context = await this.contextManager.buildContext({
      tenant,
      user: { id: userId, email: userEmail, username, type: userType },
      branchId,
      settings,
    });

    this.logger.info({
      event: 'tenant.context_resolved',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      branchId: context.branch?.id,
      userId,
    }, 'Tenant context resolved');

    return context;
  }

  async getCurrentContext(userId: string, tenantId: string): Promise<TenantContext | null> {
    return this.contextManager.loadContext(userId, tenantId);
  }

  async switchBranch(userId: string, tenantId: string, branchId: string): Promise<TenantContext> {
    const context = await this.contextManager.loadContext(userId, tenantId);
    if (!context) {
      throw new TenantException(TENANT_ERROR_CODES.CONTEXT_NOT_FOUND, 'Context not found');
    }

    const branchLookup = new DefaultTenantLookup() as unknown as IBranchLookup;
    const branch = await branchLookup.findById(branchId);
    if (!branch) {
      throw new TenantException(TENANT_ERROR_CODES.BRANCH_NOT_FOUND, `Branch ${branchId} not found`);
    }

    const newContext = this.contextManager.switchBranch(context, branch);
    await this.contextManager.buildContext({
      tenant: newContext.tenant,
      user: newContext.user,
      branchId,
      settings: newContext.settings,
    });

    return newContext;
  }

  async getTenantSettings(tenantId: string): Promise<TenantSettings> {
    return this.settingsManager.getSettings(tenantId);
  }

  async updateTenantSettings(tenantId: string, settings: Partial<TenantSettings>): Promise<void> {
    await this.settingsManager.updateSettings(tenantId, settings);
    this.logger.info({ event: 'tenant.settings.updated', tenantId }, 'Tenant settings updated');
  }

  async getTenantBranches(tenantId: string): Promise<BranchInfo[]> {
    const lookup = new DefaultTenantLookup() as unknown as IBranchLookup;
    return lookup.findByTenantId(tenantId);
  }
}
