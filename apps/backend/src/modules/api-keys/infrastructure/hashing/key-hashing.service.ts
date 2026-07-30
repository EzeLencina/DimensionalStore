import { createHash, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { IKeyHashingService } from '../../domain/services';

@Injectable()
export class KeyHashingService implements IKeyHashingService {
  async hash(plainKey: string): Promise<string> {
    return createHash('sha256').update(plainKey, 'utf8').digest('hex');
  }

  async verify(storedHash: string, plainKey: string): Promise<boolean> {
    const computedHash = createHash('sha256').update(plainKey, 'utf8').digest();
    const stored = Buffer.from(storedHash, 'hex');

    if (computedHash.length !== stored.length) {
      return false;
    }

    return timingSafeEqual(computedHash, stored);
  }
}
