import { Injectable } from '@nestjs/common';
import { TokenPair } from '../../domain/types';

@Injectable()
export class TokenRotationService {
  private readonly usedRefreshTokens: Set<string> = new Set();

  isReused(tokenId: string): boolean {
    return this.usedRefreshTokens.has(tokenId);
  }

  markAsUsed(tokenId: string): void {
    this.usedRefreshTokens.add(tokenId);
  }

  async rotate(
    oldTokenId: string,
    newTokenPair: TokenPair,
  ): Promise<{ tokenPair: TokenPair; oldTokenRevoked: boolean }> {
    this.markAsUsed(oldTokenId);
    return { tokenPair: newTokenPair, oldTokenRevoked: true };
  }
}
