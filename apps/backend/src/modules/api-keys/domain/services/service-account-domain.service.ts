import { randomUUID } from 'node:crypto';
import type { ServiceAccount, ServiceAccountStatus } from '../types';
import type { IServiceAccountStore } from './stores';
import { ApiKeyException, API_KEY_ERROR_CODES } from '../exceptions';
import { API_KEYS_CONSTANTS } from '../../constants';

export class ServiceAccountDomainService {
  constructor(private readonly store: IServiceAccountStore) {}

  async create(
    name: string,
    ownerId: string,
    description?: string,
    tenantId?: string,
    branchId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<ServiceAccount> {
    if (!name || name.trim().length === 0) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account name is required');
    }
    if (name.length > API_KEYS_CONSTANTS.SERVICE_ACCOUNT_NAME_MAX_LENGTH) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account name too long');
    }
    if (!ownerId) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Owner ID is required');
    }

    const now = new Date();
    const account: ServiceAccount = {
      id: randomUUID(),
      name: name.trim(),
      description,
      ownerId,
      tenantId,
      branchId,
      scopes: [],
      roles: [],
      permissions: [],
      status: 'active',
      metadata: metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    await this.store.save(account);
    return account;
  }

  async updateScopes(accountId: string, scopes: string[]): Promise<ServiceAccount> {
    const account = await this.store.findById(accountId);
    if (!account) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account not found');
    }
    if (account.status !== 'active') {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_DISABLED, 'Service account is not active');
    }

    account.scopes = scopes;
    account.updatedAt = new Date();
    await this.store.update(account);
    return account;
  }

  async updateRoles(accountId: string, roles: string[]): Promise<ServiceAccount> {
    const account = await this.store.findById(accountId);
    if (!account) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account not found');
    }

    account.roles = roles;
    account.updatedAt = new Date();
    await this.store.update(account);
    return account;
  }

  async updatePermissions(accountId: string, permissions: string[]): Promise<ServiceAccount> {
    const account = await this.store.findById(accountId);
    if (!account) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account not found');
    }

    account.permissions = permissions;
    account.updatedAt = new Date();
    await this.store.update(account);
    return account;
  }

  async disable(accountId: string, reason?: string): Promise<void> {
    const account = await this.store.findById(accountId);
    if (!account) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account not found');
    }

    account.status = 'disabled';
    account.disabledAt = new Date();
    account.disabledReason = reason;
    account.updatedAt = new Date();
    await this.store.update(account);
  }

  async enable(accountId: string): Promise<void> {
    const account = await this.store.findById(accountId);
    if (!account) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account not found');
    }

    account.status = 'active';
    account.disabledAt = undefined;
    account.disabledReason = undefined;
    account.updatedAt = new Date();
    await this.store.update(account);
  }

  async suspend(accountId: string, reason?: string): Promise<void> {
    const account = await this.store.findById(accountId);
    if (!account) {
      throw new ApiKeyException(API_KEY_ERROR_CODES.SERVICE_ACCOUNT_NOT_FOUND, 'Service account not found');
    }

    account.status = 'suspended';
    account.disabledAt = new Date();
    account.disabledReason = reason;
    account.updatedAt = new Date();
    await this.store.update(account);
  }

  async findById(accountId: string): Promise<ServiceAccount | null> {
    return this.store.findById(accountId);
  }

  async findByOwnerId(ownerId: string): Promise<ServiceAccount[]> {
    return this.store.findByOwnerId(ownerId);
  }
}
