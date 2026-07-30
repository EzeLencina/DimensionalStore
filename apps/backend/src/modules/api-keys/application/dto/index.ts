export interface CreateApiKeyRequestDto {
  serviceAccountId: string;
  displayName: string;
  description?: string;
  scopes: string[];
  expiresAt?: string;
  prefix?: string;
}

export interface CreateApiKeyResponseDto {
  id: string;
  plainKey: string;
  keyPrefix: string;
  keyLastChars: string;
  version: number;
  displayName: string;
  scopes: string[];
  expiresAt?: string;
  createdAt: string;
}

export interface ApiKeyResponseDto {
  id: string;
  keyPrefix: string;
  keyLastChars: string;
  version: number;
  serviceAccountId: string;
  displayName: string;
  description?: string;
  scopes: string[];
  status: string;
  expiresAt?: string;
  lastUsedAt?: string;
  createdAt: string;
  rotatedAt?: string;
  revokedAt?: string;
  revokedReason?: string;
}

export interface CreateServiceAccountRequestDto {
  name: string;
  description?: string;
  ownerId: string;
  tenantId?: string;
  branchId?: string;
  metadata?: Record<string, unknown>;
}

export interface ServiceAccountResponseDto {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  tenantId?: string;
  branchId?: string;
  scopes: string[];
  roles: string[];
  permissions: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RotateKeyResponseDto {
  newKeyId: string;
  plainKey: string;
  oldKeyId: string;
  oldKeyVersion: number;
  newVersion: number;
  gracePeriodEndsAt: string;
}

export interface MachineAuthResponseDto {
  authenticated: boolean;
  serviceAccountId?: string;
  scopes: string[];
}

export interface ScopeValidationResponseDto {
  valid: boolean;
  missing: string[];
}
