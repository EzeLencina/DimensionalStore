import { randomBytes, createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { IKeyGeneratorService } from '../../domain/services';
import { API_KEYS_CONSTANTS } from '../../constants';

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i]! % chars.length];
  }
  return result;
}

@Injectable()
export class KeyGeneratorService implements IKeyGeneratorService {
  generateKey(prefix?: string): { plainKey: string; keyHash: string; keyPrefix: string; keyLastChars: string } {
    const keyPrefix = prefix ?? API_KEYS_CONSTANTS.KEY_PREFIX;
    const randomPart = generateRandomString(API_KEYS_CONSTANTS.KEY_RANDOM_BYTES);
    const plainKey = `${keyPrefix}${API_KEYS_CONSTANTS.KEY_SEPARATOR}${randomPart}`;
    const keyHash = createHash('sha256').update(plainKey, 'utf8').digest('hex');
    const keyLastChars = randomPart.slice(-API_KEYS_CONSTANTS.KEY_DISPLAY_SUFFIX_LENGTH);

    return { plainKey, keyHash, keyPrefix, keyLastChars };
  }
}
