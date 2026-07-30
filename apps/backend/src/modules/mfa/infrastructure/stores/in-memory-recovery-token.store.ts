import { Injectable } from '@nestjs/common';
import { RecoveryToken } from '../../domain/types';

@Injectable()
export class InMemoryRecoveryTokenStore {
  private tokens = new Map<string, RecoveryToken>();

  async save(token: RecoveryToken): Promise<void> {
    this.tokens.set(token.id, { ...token });
  }

  async findById(id: string): Promise<RecoveryToken | null> {
    const found = this.tokens.get(id);
    return found ? { ...found } : null;
  }

  async findByUserId(userId: string): Promise<RecoveryToken[]> {
    return Array.from(this.tokens.values())
      .filter(t => t.userId === userId)
      .map(t => ({ ...t }));
  }

  async findByUserIdActive(userId: string): Promise<RecoveryToken | null> {
    const found = Array.from(this.tokens.values())
      .find(t => t.userId === userId && !t.used && t.expiresAt > new Date());
    return found ? { ...found } : null;
  }

  async update(token: RecoveryToken): Promise<void> {
    this.tokens.set(token.id, { ...token });
  }

  async deleteByUserId(userId: string): Promise<void> {
    for (const [key, t] of this.tokens) {
      if (t.userId === userId) {
        this.tokens.delete(key);
      }
    }
  }
}
