import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MfaChallenge } from '../../domain/types';

@Injectable()
export class InMemoryChallengeStore {
  private challenges = new Map<string, MfaChallenge>();

  async save(challenge: MfaChallenge): Promise<void> {
    this.challenges.set(challenge.id, { ...challenge });
  }

  async findById(challengeId: string): Promise<MfaChallenge | null> {
    const found = this.challenges.get(challengeId);
    return found ? { ...found } : null;
  }

  async findByUserId(userId: string): Promise<MfaChallenge[]> {
    return Array.from(this.challenges.values())
      .filter(c => c.userId === userId)
      .map(c => ({ ...c }));
  }

  async update(challenge: MfaChallenge): Promise<void> {
    this.challenges.set(challenge.id, { ...challenge });
  }

  async delete(challengeId: string): Promise<void> {
    this.challenges.delete(challengeId);
  }

  async deleteByUserId(userId: string): Promise<void> {
    for (const [id, c] of this.challenges) {
      if (c.userId === userId) {
        this.challenges.delete(id);
      }
    }
  }

  async cleanExpired(): Promise<number> {
    let count = 0;
    const now = new Date();
    for (const [id, c] of this.challenges) {
      if (c.expiresAt <= now) {
        this.challenges.delete(id);
        count++;
      }
    }
    return count;
  }
}
