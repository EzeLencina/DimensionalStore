import { Provider } from '@nestjs/common';
import type { IApiKeyService } from '../application/interfaces';
import { ApiKeyAppService } from '../services';
import { KeyHashingService } from '../infrastructure/hashing';
import { KeyGeneratorService } from '../infrastructure/generator';
import { InMemoryApiKeyStore, InMemoryServiceAccountStore } from '../infrastructure/stores';

export const ApiKeyServiceProvider: Provider<IApiKeyService> = {
  provide: 'IApiKeyService',
  useClass: ApiKeyAppService,
};

export const ApiKeyStoreProvider: Provider = {
  provide: 'IApiKeyStore',
  useClass: InMemoryApiKeyStore,
};

export const ServiceAccountStoreProvider: Provider = {
  provide: 'IServiceAccountStore',
  useClass: InMemoryServiceAccountStore,
};

export const KeyHashingServiceProvider: Provider = {
  provide: 'IKeyHashingService',
  useClass: KeyHashingService,
};

export const KeyGeneratorServiceProvider: Provider = {
  provide: 'IKeyGeneratorService',
  useClass: KeyGeneratorService,
};

export const API_KEY_PROVIDERS: Provider[] = [
  ApiKeyServiceProvider,
  ApiKeyStoreProvider,
  ServiceAccountStoreProvider,
  KeyHashingServiceProvider,
  KeyGeneratorServiceProvider,
];
