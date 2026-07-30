import { Module } from '@nestjs/common';
import { API_KEY_PROVIDERS } from './providers';
import { ApiKeyAppService } from './services';
import { ApiKeyEventHandler } from './events';
import { ApiKeyExceptionFilter } from './exceptions';
import { ApiKeyGuard, ServiceAccountGuard, ScopeGuard, MachineAuthGuard } from './presentation/guards';
import { ApiKeyDomainService } from './domain/services';

@Module({
  providers: [
    ...API_KEY_PROVIDERS,
    ApiKeyAppService,
    ApiKeyEventHandler,
    ApiKeyExceptionFilter,
    ApiKeyGuard,
    ServiceAccountGuard,
    ScopeGuard,
    MachineAuthGuard,
  ],
  exports: [
    ApiKeyAppService,
    'IApiKeyService',
    ApiKeyGuard,
    ServiceAccountGuard,
    ScopeGuard,
    MachineAuthGuard,
  ],
})
export class ApiKeysModule {}
