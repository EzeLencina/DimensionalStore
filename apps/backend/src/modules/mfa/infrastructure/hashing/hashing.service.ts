import { createHash, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { IBackupCodeHashing } from '../../domain/services';

@Injectable()
export class Sha256HashingService implements IBackupCodeHashing {
  async hash(code: string): Promise<string> {
    return createHash('sha256').update(code, 'utf8').digest('hex');
  }

  async verify(storedHash: string, providedCode: string): Promise<boolean> {
    const computedHash = createHash('sha256').update(providedCode, 'utf8').digest();
    const stored = Buffer.from(storedHash, 'hex');

    if (computedHash.length !== stored.length) {
      return false;
    }

    return timingSafeEqual(computedHash, stored);
  }
}
