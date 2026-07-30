import { randomUUID } from 'node:crypto';
import type { ApiKey, ApiKeyCreateResult, ApiKeyStatus, KeyValidationResult, KeyRotationResult } from '../types';
import type { IApiKeyStore, IServiceAccountStore, IKeyHashingService, IKeyGeneratorService } from './stores';
import { Scope } from '../value-objects';
import { ApiKeyException, API_KEY_ERROR_CODES } from '../exceptions';
import { API_KEYS_CONSTANTS } from '../../constants';

export class ApiKeyDomainService {
  constructor(
    private readonly apiKeyStore: IApiKeyStore,
    private readonly serviceAccountStore: IServiceAccountStore,
    private readonly hashingService: IKeyHashingService,
    private readonly keyGenerator: IKeyGeneratorService,
  ) {}

  async createKey(
    serviceAccountId: string,
    displayName: string,
    scopes: string[],
    description?: string,
    expiresAt?: Date,
    prefix: string = API_KEYS_CONSTANTS.KEY_PREFIX,
  ): Promise<ApiKeyCreateResult> {
    const account = await this.serviceAccountStore.findById(serviceAccountId);
    if (!account) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account not found');
    }
    if (account.status !== 'active') {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_DISABLED, 'Service account is not active');
    }

    const activeKeys = await this.apiKeyStore.findActiveByServiceAccountId(serviceAccountId);
    if (activeKeys.length >= API_KEYS_CONSTANTS.MAX_ACTIVE_KEYS_PER_SERVICE_ACCOUNT) {
      throw new ApiKeyException(
        API_KEY_ERROR_CODES.KEY_LIMIT_EXCEEDED,
        `Maximum active keys reached (${API_KEYS_CONSTANTS.MAX_ACTIVE_KEYS_PER_SERVICE_ACCOUNT})`,
      );
    }

    this.validateScopes(scopes);

    const { plainKey, keyHash, keyPrefix, keyLastChars } = this.keyGenerator.generateKey(prefix);

    const now = new Date();
    const apiKey: ApiKey = {
      id: randomUUID(),
      keyPrefix,
      keyHash,
      keyLastChars,
      version: API_KEYS_CONSTANTS.KEY_VERSION_INITIAL,
      serviceAccountId,
      displayName,
      description,
      scopes,
      status: 'active',
      expiresAt,
      createdAt: now,
    };

    await this.apiKeyStore.save(apiKey);

    return { apiKey, plainKey };
  }

  async validateKey(plainKey: string): Promise<KeyValidationResult> {
    if (!plainKey || plainKey.length < API_KEYS_CONSTANTS.KEY_MIN_LENGTH) {
      return { valid: false, reason: 'Invalid key format' };
    }

    const keyHash = await this.hashingService.hash(plainKey);
    const apiKey = await this.apiKeyStore.findByKeyHash(keyHash);

    if (!apiKey) {
      return { valid: false, reason: 'Key not found' };
    }

    if (apiKey.status === 'revoked') {
      return { valid: false, reason: 'Key has been revoked' };
    }

    if (apiKey.status === 'expired') {
      return { valid: false, reason: 'Key has expired' };
    }

    if (apiKey.expiresAt && apiKey.expiresAt <= new Date()) {
      apiKey.status = 'expired';
      await this.apiKeyStore.update(apiKey);
      return { valid: false, reason: 'Key has expired' };
    }

    const account = await this.serviceAccountStore.findById(apiKey.serviceAccountId);
    if (!account) {
      return { valid: false, reason: 'Service account not found' };
    }
    if (account.status !== 'active') {
      return { valid: false, reason: `Service account is ${account.status}` };
    }

    apiKey.lastUsedAt = new Date();
    await this.apiKeyStore.update(apiKey);

    return { valid: true, apiKey, serviceAccount: account };
  }

  async rotateKey(keyId: string, prefix: string = API_KEYS_CONSTANTS.KEY_PREFIX): Promise<KeyRotationResult> {
    const existing = await this.apiKeyStore.findById(keyId);
    if (!existing) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.KEY_NOT_FOUND, 'Key not found');
    }
    if (existing.status === 'revoked') {
      throw new ApiKeyException(API_KEY_ERROR_CODES.KEY_ALREADY_REVOKED, 'Cannot rotate a revoked key');
    }

    const account = await this.serviceAccountStore.findById(existing.serviceAccountId);
    if (!account || account.status !== 'active') {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_DISABLED, 'Service account is not active');
    }

    const { plainKey, keyHash, keyPrefix, keyLastChars } = this.keyGenerator.generateKey(prefix);

    const now = new Date();
    const gracePeriodEndsAt = new Date(now.getTime() + API_KEYS_CONSTANTS.KEY_ROTATION_GRACE_PERIOD_HOURS * 60 * 60 * 1000);

    existing.status = 'rotating';
    existing.rotatedAt = now;
    await this.apiKeyStore.update(existing);

    const newKey: ApiKey = {
      id: randomUUID(),
      keyPrefix,
      keyHash,
      keyLastChars,
      version: existing.version + 1,
      serviceAccountId: existing.serviceAccountId,
      displayName: existing.displayName,
      description: existing.description,
      scopes: [...existing.scopes],
      status: 'active',
      expiresAt: existing.expiresAt,
      createdAt: now,
    };

    await this.apiKeyStore.save(newKey);

    return {
      newKeyId: newKey.id,
      plainKey,
      oldKeyId: keyId,
      oldKeyVersion: existing.version,
      newVersion: newKey.version,
      gracePeriodEndsAt,
    };
  }

  async revokeKey(keyId: string, reason?: string): Promise<void> {
    const key = await this.apiKeyStore.findById(keyId);
    if (!key) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.KEY_NOT_FOUND, 'Key not found');
    }
    if (key.status === 'revoked') {
      throw new ApiKeyException(API_KEY_ERROR_CODES.KEY_ALREADY_REVOKED, 'Key is already revoked');
    }

    key.status = 'revoked';
    key.revokedAt = new Date();
    key.revokedReason = reason;
    await this.apiKeyStore.update(key);
  }

  async markUsed(keyId: string, ipAddress?: string): Promise<void> {
    const key = await this.apiKeyStore.findById(keyId);
    if (key) {
      key.lastUsedAt = new Date();
      key.lastIpAddress = ipAddress;
      await this.apiKeyStore.update(key);
    }
  }

  async cleanExpired(): Promise<number> {
    let count = 0;
    const now = new Date();
    const keys = await this.apiKeyStore.findByServiceAccountId('');
    for (const key of keys) {
      if (key.expiresAt && key.expiresAt <= now && key.status === 'active') {
        key.status = 'expired';
        await this.apiKeyStore.update(key);
        count++;
      }
    }
    return count;
  }

  private validateScopes(scopes: string[]): void {
    for (const s of scopes) {
      try {
        new Scope(s);
      } catch {
        throw new ApiKeyException(API_KEY_ERROR_CODES.SCOPE_INVALID, `Invalid scope: ${s}`);
      }
    }
  }
}
