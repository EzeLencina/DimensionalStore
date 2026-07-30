import { createHmac, randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { ITotpService } from '../../application/interfaces';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer: Buffer): string {
  let result = '';
  let bits = 0;
  let value = 0;

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i]!;
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      result += BASE32_ALPHABET[(value >> bits) & 0x1f];
    }
  }

  if (bits > 0) {
    result += BASE32_ALPHABET[(value << (5 - bits)) & 0x1f];
  }

  while (result.length % 8 !== 0) {
    result += '=';
  }

  return result;
}

function dynamicTruncation(hmacResult: Buffer): number {
  const offset = hmacResult[hmacResult.length - 1]! & 0xf;
  const code =
    ((hmacResult[offset]! & 0x7f) << 24) |
    ((hmacResult[offset + 1]! & 0xff) << 16) |
    ((hmacResult[offset + 2]! & 0xff) << 8) |
    (hmacResult[offset + 3]! & 0xff);
  return code;
}

@Injectable()
export class TotpGeneratorService implements ITotpService {
  private readonly digits = 6;
  private readonly period = 30;
  private readonly algorithm = 'sha1';

  generateSecret(): { secret: Buffer; base32: string } {
    const secret = randomBytes(20);
    const base32 = base32Encode(secret);
    return { secret, base32 };
  }

  generateCode(secretBase32: string, time?: number): string {
    const secret = this.decodeBase32(secretBase32);
    const timeValue = time ?? Math.floor(Date.now() / 1000);
    const counter = Math.floor(timeValue / this.period);
    const counterBuffer = Buffer.alloc(8);
    for (let i = 7; i >= 0; i--) {
      counterBuffer[i] = counter & 0xff;
    }

    const hmac = createHmac(this.algorithm, secret);
    hmac.update(counterBuffer);
    const hmacResult = hmac.digest();

    const truncated = dynamicTruncation(hmacResult);
    const code = truncated % Math.pow(10, this.digits);

    return code.toString().padStart(this.digits, '0');
  }

  verifyCode(secret: string, token: string, window: number = 1): boolean {
    const now = Math.floor(Date.now() / 1000);
    const timeStep = this.period;

    for (let i = -window; i <= window; i++) {
      const checkTime = now + i * timeStep;
      const expectedToken = this.generateCode(secret, checkTime);
      if (expectedToken === token) {
        return true;
      }
    }

    return false;
  }

  getQrPayload(secret: string, issuer: string, account: string): string {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedAccount = encodeURIComponent(account);
    const params = new URLSearchParams({
      secret,
      issuer,
      algorithm: 'SHA1',
      digits: '6',
      period: '30',
    });
    return `otpauth://totp/${encodedIssuer}:${encodedAccount}?${params.toString()}`;
  }

  private decodeBase32(encoded: string): Buffer {
    const clean = encoded.replace(/[=]/g, '').toUpperCase();
    const bits: number[] = [];

    for (const char of clean) {
      const idx = BASE32_ALPHABET.indexOf(char);
      if (idx === -1) continue;
      for (let i = 4; i >= 0; i--) {
        bits.push((idx >> i) & 1);
      }
    }

    const bytes: number[] = [];
    for (let i = 0; i + 7 < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | bits[i + j]!;
      }
      bytes.push(byte);
    }

    return Buffer.from(bytes);
  }
}
