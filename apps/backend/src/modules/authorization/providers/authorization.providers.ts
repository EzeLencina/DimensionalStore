import { Provider } from '@nestjs/common';
import { IAuthorizationService, IRoleRepository, IPolicyRepository, IPermissionRegistry } from '../application/interfaces';
import { AuthorizationAppService } from '../services';
import { InMemoryRoleRepository, InMemoryPolicyRepository } from '../infrastructure/repositories';
import { PermissionRegistry } from '../infrastructure/registry';

export const AuthorizationServiceProvider: Provider<IAuthorizationService> = {
  provide: 'IAuthorizationService',
  useClass: AuthorizationAppService,
};

export const RoleRepositoryProvider: Provider<IRoleRepository> = {
  provide: 'IRoleRepository',
  useClass: InMemoryRoleRepository,
};

export const PolicyRepositoryProvider: Provider<IPolicyRepository> = {
  provide: 'IPolicyRepository',
  useClass: InMemoryPolicyRepository,
};

export const PermissionRegistryProvider: Provider<IPermissionRegistry> = {
  provide: 'IPermissionRegistry',
  useClass: PermissionRegistry,
};

export const AUTHORIZATION_PROVIDERS: Provider[] = [
  AuthorizationServiceProvider,
  RoleRepositoryProvider,
  PolicyRepositoryProvider,
  PermissionRegistryProvider,
];
