import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IApiKeyService } from '../application/interfaces';
import type { IApiKeyStore, IServiceAccountStore, IKeyHashingService, IKeyGeneratorService } from '../domain/services';
import { ApiKeyDomainService, ServiceAccountDomainService, ScopeResolver } from '../domain/services';
import { KeyCreatedEvent, KeyRotatedEvent, KeyRevokedEvent, KeyExpiredEvent, KeyUsedEvent, ServiceAccountCreatedEvent, ServiceAccountDisabledEvent, MachineAuthenticatedEvent } from '../domain/events';
import type { ApiKey, ApiKeyCreateResult, ServiceAccount, KeyValidationResult, KeyRotationResult, MachineAuthResult } from '../domain/types';

@Injectable()
export class ApiKeyAppService implements IApiKeyService {
  private readonly apiKeyDomainService: ApiKeyDomainService;
  private readonly serviceAccountDomainService: ServiceAccountDomainService;
  private readonly scopeResolver = new ScopeResolver();

  constructor(
    @Inject('IApiKeyStore') apiKeyStore: IApiKeyStore,
    @Inject('IServiceAccountStore') serviceAccountStore: IServiceAccountStore,
    @Inject('IKeyHashingService') hashingService: IKeyHashingService,
    @Inject('IKeyGeneratorService') keyGenerator: IKeyGeneratorService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {
    this.apiKeyDomainService = new ApiKeyDomainService(apiKeyStore, serviceAccountStore, hashingService, keyGenerator);
    this.serviceAccountDomainService = new ServiceAccountDomainService(serviceAccountStore);
  }

  async createKey(serviceAccountId: string, displayName: string, scopes: string[], description?: string, expiresAt?: Date, prefix?: string): Promise<ApiKeyCreateResult> {
    const result = await this.apiKeyDomainService.createKey(serviceAccountId, displayName, scopes, description, expiresAt, prefix);

    this.logger.info(
      { event: 'api_keys.key_created', keyId: result.apiKey.id, serviceAccountId },
      'API key created',
    );

    return result;
  }

  async validateKey(plainKey: string): Promise<KeyValidationResult> {
    const result = await this.apiKeyDomainService.validateKey(plainKey);

    if (result.valid && result.apiKey) {
      this.logger.info(
        { event: 'api_keys.key_validated', keyId: result.apiKey.id, serviceAccountId: result.apiKey.serviceAccountId },
        'API key validated',
      );
    }

    return result;
  }

  async rotateKey(keyId: string, prefix?: string): Promise<KeyRotationResult> {
    const result = await this.apiKeyDomainService.rotateKey(keyId, prefix);

    this.logger.info(
      { event: 'api_keys.key_rotated', keyId, newKeyId: result.newKeyId, serviceAccountId: result.newKeyId },
      'API key rotated',
    );

    return result;
  }

  async revokeKey(keyId: string, reason?: string): Promise<void> {
    await this.apiKeyDomainService.revokeKey(keyId, reason);

    this.logger.info(
      { event: 'api_keys.key_revoked', keyId, reason },
      'API key revoked',
    );
  }

  async getKey(keyId: string): Promise<ApiKey | null> {
    return this.apiKeyDomainService['apiKeyStore'].findById(keyId);
  }

  async getKeysByServiceAccount(serviceAccountId: string): Promise<ApiKey[]> {
    return this.apiKeyDomainService['apiKeyStore'].findByServiceAccountId(serviceAccountId);
  }

  async createServiceAccount(name: string, ownerId: string, description?: string, tenantId?: string, branchId?: string, metadata?: Record<string, unknown>): Promise<ServiceAccount> {
    const account = await this.serviceAccountDomainService.create(name, ownerId, description, tenantId, branchId, metadata);

    this.logger.info(
      { event: 'api_keys.service_account_created', accountId: account.id, ownerId },
      'Service account created',
    );

    return account;
  }

  async getServiceAccount(accountId: string): Promise<ServiceAccount | null> {
    return this.serviceAccountDomainService.findById(accountId);
  }

  async getServiceAccountsByOwner(ownerId: string): Promise<ServiceAccount[]> {
    return this.serviceAccountDomainService.findByOwnerId(ownerId);
  }

  async disableServiceAccount(accountId: string, reason?: string): Promise<void> {
    await this.serviceAccountDomainService.disable(accountId, reason);

    this.logger.info(
      { event: 'api_keys.service_account_disabled', accountId, reason },
      'Service account disabled',
    );
  }

  async enableServiceAccount(accountId: string): Promise<void> {
    await this.serviceAccountDomainService.enable(accountId);

    this.logger.info(
      { event: 'api_keys.service_account_enabled', accountId },
      'Service account enabled',
    );
  }

  async updateServiceAccountScopes(accountId: string, scopes: string[]): Promise<ServiceAccount> {
    return this.serviceAccountDomainService.updateScopes(accountId, scopes);
  }

  async updateServiceAccountRoles(accountId: string, roles: string[]): Promise<ServiceAccount> {
    return this.serviceAccountDomainService.updateRoles(accountId, roles);
  }

  async authenticateMachine(plainKey: string, requiredScopes?: string[]): Promise<MachineAuthResult> {
    const result = await this.apiKeyDomainService.validateKey(plainKey);

    if (!result.valid || !result.apiKey || !result.serviceAccount) {
      return { authenticated: false, scopes: [], reason: result.reason ?? 'Authentication failed' };
    }

    if (requiredScopes && requiredScopes.length > 0) {
      const scopeCheck = this.scopeResolver.hasAllScopes(result.serviceAccount.scopes, requiredScopes);
      if (!scopeCheck.valid) {
        this.logger.warn(
          { event: 'api_keys.machine_auth_scope_missing', serviceAccountId: result.serviceAccount.id, missing: scopeCheck.missing },
          'Machine authentication failed — missing scopes',
        );
        return { authenticated: false, scopes: result.serviceAccount.scopes, reason: `Missing scopes: ${scopeCheck.missing.join(', ')}` };
      }
    }

    this.logger.info(
      { event: 'api_keys.machine_authenticated', serviceAccountId: result.serviceAccount.id, keyId: result.apiKey.id },
      'Machine authenticated',
    );

    return {
      authenticated: true,
      serviceAccount: result.serviceAccount,
      apiKey: result.apiKey,
      scopes: result.serviceAccount.scopes,
    };
  }

  hasScope(accountScopes: string[], requiredScope: string): boolean {
    return this.scopeResolver.hasScope(accountScopes, requiredScope);
  }

  hasAllScopes(accountScopes: string[], requiredScopes: string[]): { valid: boolean; missing: string[] } {
    return this.scopeResolver.hasAllScopes(accountScopes, requiredScopes);
  }
}
