import { Module } from '@nestjs/common';
import { AUTHORIZATION_PROVIDERS } from './providers';
import { AuthorizationAppService } from './services';
import { AuthorizationEventHandler } from './events';
import { AuthorizationExceptionFilter } from './exceptions';
import { PermissionGuard, RoleGuard, PolicyGuard, CompositeGuard } from './presentation/guards';
import { AuthorizationContextInterceptor, PermissionResolutionInterceptor, AuditContextInterceptor } from './presentation/interceptors';

@Module({
  providers: [
    ...AUTHORIZATION_PROVIDERS,
    AuthorizationAppService,
    AuthorizationEventHandler,
    AuthorizationExceptionFilter,
    PermissionGuard,
    RoleGuard,
    PolicyGuard,
    CompositeGuard,
    AuthorizationContextInterceptor,
    PermissionResolutionInterceptor,
    AuditContextInterceptor,
  ],
  exports: [
    AuthorizationAppService,
    'IAuthorizationService',
    'IRoleRepository',
    'IPolicyRepository',
    'IPermissionRegistry',
    PermissionGuard,
    RoleGuard,
    PolicyGuard,
    CompositeGuard,
  ],
})
export class AuthorizationModule {}
