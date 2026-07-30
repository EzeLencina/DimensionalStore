import { Provider } from '@nestjs/common';
import { ITenantService } from '../application/interfaces';
import { TenantAppService } from '../services';

export const TenantServiceProvider: Provider<ITenantService> = {
  provide: 'ITenantService',
  useClass: TenantAppService,
};

export const TENANT_PROVIDERS: Provider[] = [
  TenantServiceProvider,
];
