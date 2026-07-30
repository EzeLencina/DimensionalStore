import { Injectable } from '@nestjs/common';
import type { ServiceAccount } from '../../domain/types';

@Injectable()
export class InMemoryServiceAccountStore {
  private accounts = new Map<string, ServiceAccount>();

  async save(account: ServiceAccount): Promise<void> {
    this.accounts.set(account.id, { ...account });
  }

  async findById(id: string): Promise<ServiceAccount | null> {
    const found = this.accounts.get(id);
    return found ? { ...found } : null;
  }

  async findByOwnerId(ownerId: string): Promise<ServiceAccount[]> {
    return Array.from(this.accounts.values())
      .filter(a => a.ownerId === ownerId)
      .map(a => ({ ...a }));
  }

  async update(account: ServiceAccount): Promise<void> {
    this.accounts.set(account.id, { ...account });
  }

  async delete(id: string): Promise<void> {
    this.accounts.delete(id);
  }
}
