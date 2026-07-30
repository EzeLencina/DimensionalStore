import { Injectable } from '@nestjs/common';
import type { ApiKey } from '../../domain/types';

@Injectable()
export class InMemoryApiKeyStore {
  private keys = new Map<string, ApiKey>();

  async save(key: ApiKey): Promise<void> {
    this.keys.set(key.id, { ...key });
  }

  async findById(id: string): Promise<ApiKey | null> {
    const found = this.keys.get(id);
    return found ? { ...found } : null;
  }

  async findByKeyHash(keyHash: string): Promise<ApiKey | null> {
    const found = Array.from(this.keys.values()).find(k => k.keyHash === keyHash);
    return found ? { ...found } : null;
  }

  async findByServiceAccountId(serviceAccountId: string): Promise<ApiKey[]> {
    return Array.from(this.keys.values())
      .filter(k => k.serviceAccountId === serviceAccountId)
      .map(k => ({ ...k }));
  }

  async findActiveByServiceAccountId(serviceAccountId: string): Promise<ApiKey[]> {
    return Array.from(this.keys.values())
      .filter(k => k.serviceAccountId === serviceAccountId && (k.status === 'active' || k.status === 'rotating'))
      .map(k => ({ ...k }));
  }

  async update(key: ApiKey): Promise<void> {
    this.keys.set(key.id, { ...key });
  }

  async delete(id: string): Promise<void> {
    this.keys.delete(id);
  }
}
