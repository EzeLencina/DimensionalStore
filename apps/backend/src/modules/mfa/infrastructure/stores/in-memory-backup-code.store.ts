import { Injectable } from '@nestjs/common';
import { BackupCode } from '../../domain/types';

@Injectable()
export class InMemoryBackupCodeStore {
  private codes = new Map<string, BackupCode>();

  async save(code: BackupCode): Promise<void> {
    this.codes.set(code.id, { ...code });
  }

  async saveMany(codes: BackupCode[]): Promise<void> {
    for (const code of codes) {
      this.codes.set(code.id, { ...code });
    }
  }

  async findById(id: string): Promise<BackupCode | null> {
    const found = this.codes.get(id);
    return found ? { ...found } : null;
  }

  async findByUserId(userId: string): Promise<BackupCode[]> {
    return Array.from(this.codes.values())
      .filter(c => c.userId === userId)
      .map(c => ({ ...c }));
  }

  async findUnusedByUserId(userId: string): Promise<BackupCode[]> {
    return Array.from(this.codes.values())
      .filter(c => c.userId === userId && !c.used)
      .map(c => ({ ...c }));
  }

  async update(code: BackupCode): Promise<void> {
    this.codes.set(code.id, { ...code });
  }

  async deleteByUserId(userId: string): Promise<void> {
    for (const [key, c] of this.codes) {
      if (c.userId === userId) {
        this.codes.delete(key);
      }
    }
  }
}
