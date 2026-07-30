import type { ApiKey, ApiKeyCreateResult, ServiceAccount, KeyValidationResult, KeyRotationResult, MachineAuthResult } from '../../domain/types';

export interface IApiKeyService {
  createKey(serviceAccountId: string, displayName: string, scopes: string[], description?: string, expiresAt?: Date, prefix?: string): Promise<ApiKeyCreateResult>;
  validateKey(plainKey: string): Promise<KeyValidationResult>;
  rotateKey(keyId: string, prefix?: string): Promise<KeyRotationResult>;
  revokeKey(keyId: string, reason?: string): Promise<void>;
  getKey(keyId: string): Promise<ApiKey | null>;
  getKeysByServiceAccount(serviceAccountId: string): Promise<ApiKey[]>;
  createServiceAccount(name: string, ownerId: string, description?: string, tenantId?: string, branchId?: string, metadata?: Record<string, unknown>): Promise<ServiceAccount>;
  getServiceAccount(accountId: string): Promise<ServiceAccount | null>;
  getServiceAccountsByOwner(ownerId: string): Promise<ServiceAccount[]>;
  disableServiceAccount(accountId: string, reason?: string): Promise<void>;
  enableServiceAccount(accountId: string): Promise<void>;
  updateServiceAccountScopes(accountId: string, scopes: string[]): Promise<ServiceAccount>;
  updateServiceAccountRoles(accountId: string, roles: string[]): Promise<ServiceAccount>;
  authenticateMachine(plainKey: string, requiredScopes?: string[]): Promise<MachineAuthResult>;
  hasScope(accountScopes: string[], requiredScope: string): boolean;
  hasAllScopes(accountScopes: string[], requiredScopes: string[]): { valid: boolean; missing: string[] };
}
