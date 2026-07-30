import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private readonly blacklist: Map<string, number> = new Map();

  add(tokenId: string, expiresAt: number): void {
    this.blacklist.set(tokenId, expiresAt);
  }

  isBlacklisted(tokenId: string): boolean {
    const expiresAt = this.blacklist.get(tokenId);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.blacklist.delete(tokenId);
      return false;
    }
    return true;
  }

  remove(tokenId: string): void {
    this.blacklist.delete(tokenId);
  }

  clear(): void {
    this.blacklist.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [tokenId, expiresAt] of this.blacklist.entries()) {
      if (now > expiresAt) {
        this.blacklist.delete(tokenId);
      }
    }
  }
}
