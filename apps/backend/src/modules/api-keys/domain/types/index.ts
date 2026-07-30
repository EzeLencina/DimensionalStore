export type ApiKeyStatus = 'active' | 'rotating' | 'revoked' | 'expired';

export type ServiceAccountStatus = 'active' | 'disabled' | 'suspended';

export interface ApiKey {
  id: string;
  keyPrefix: string;
  keyHash: string;
  keyLastChars: string;
  version: number;
  serviceAccountId: string;
  displayName: string;
  description?: string;
  scopes: string[];
  status: ApiKeyStatus;
  expiresAt?: Date;
  lastUsedAt?: Date;
  lastIpAddress?: string;
  createdAt: Date;
  rotatedAt?: Date;
  revokedAt?: Date;
  revokedReason?: string;
}

export interface ApiKeyCreateResult {
  apiKey: ApiKey;
  plainKey: string;
}

export interface ServiceAccount {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  tenantId?: string;
  branchId?: string;
  scopes: string[];
  roles: string[];
  permissions: string[];
  status: ServiceAccountStatus;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  disabledAt?: Date;
  disabledReason?: string;
}

export interface KeyValidationResult {
  valid: boolean;
  apiKey?: ApiKey;
  serviceAccount?: ServiceAccount;
  reason?: string;
}

export interface ScopeDefinition {
  resource: string;
  action: string;
  wildcard: boolean;
}

export interface KeyRotationResult {
  newKeyId: string;
  plainKey: string;
  oldKeyId: string;
  oldKeyVersion: number;
  newVersion: number;
  gracePeriodEndsAt: Date;
}

export interface MachineAuthResult {
  authenticated: boolean;
  serviceAccount?: ServiceAccount;
  apiKey?: ApiKey;
  scopes: string[];
  reason?: string;
}
