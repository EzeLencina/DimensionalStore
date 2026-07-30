import type { ApiKey, ServiceAccount } from '../types';

export interface IApiKeyStore {
  save(key: ApiKey): Promise<void>;
  findById(id: string): Promise<ApiKey | null>;
  findByKeyHash(keyHash: string): Promise<ApiKey | null>;
  findByServiceAccountId(serviceAccountId: string): Promise<ApiKey[]>;
  findActiveByServiceAccountId(serviceAccountId: string): Promise<ApiKey[]>;
  update(key: ApiKey): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IServiceAccountStore {
  save(account: ServiceAccount): Promise<void>;
  findById(id: string): Promise<ServiceAccount | null>;
  findByOwnerId(ownerId: string): Promise<ServiceAccount[]>;
  update(account: ServiceAccount): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IKeyHashingService {
  hash(plainKey: string): Promise<string>;
  verify(hash: string, plainKey: string): Promise<boolean>;
}

export interface IKeyGeneratorService {
  generateKey(prefix: string): { plainKey: string; keyHash: string; keyPrefix: string; keyLastChars: string };
}
