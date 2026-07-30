import { Module } from '@nestjs/common';
import { TENANT_PROVIDERS } from './providers';
import { TenantAppService } from './services';
import { TenantEventHandler } from './events';
import { TenantExceptionFilter } from './exceptions';
import { TenantContextMiddleware, BranchContextMiddleware, LocaleTimezoneMiddleware } from './presentation/middleware';
import { TenantGuard, BranchGuard, OrganizationGuard } from './presentation/guards';
import { TenantContextInterceptor } from './presentation/interceptors';

@Module({
  providers: [
    ...TENANT_PROVIDERS,
    TenantAppService,
    TenantEventHandler,
    TenantExceptionFilter,
    TenantContextMiddleware,
    BranchContextMiddleware,
    LocaleTimezoneMiddleware,
    TenantGuard,
    BranchGuard,
    OrganizationGuard,
    TenantContextInterceptor,
  ],
  exports: [
    TenantAppService,
    'ITenantService',
    TenantContextMiddleware,
    BranchContextMiddleware,
    LocaleTimezoneMiddleware,
    TenantGuard,
    BranchGuard,
    OrganizationGuard,
    TenantContextInterceptor,
  ],
})
export class TenantModule {}
