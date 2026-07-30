import { randomBytes, createHash } from 'node:crypto';

export class GuestCartToken {
  private readonly raw: string;
  private readonly hash: string;

  private constructor(raw: string, hash: string) {
    this.raw = raw;
    this.hash = hash;
    Object.freeze(this);
  }

  static generate(): GuestCartToken {
    const raw = randomBytes(32).toString('base64url');
    const hash = createHash('sha256').update(raw).digest('hex');
    return new GuestCartToken(raw, hash);
  }

  static fromHash(hash: string): GuestCartToken {
    if (!hash || hash.length !== 64) throw new Error('Invalid guest token hash');
    return new GuestCartToken('', hash);
  }

  getRaw(): string { return this.raw; }
  getHash(): string { return this.hash; }
  hasRaw(): boolean { return this.raw.length > 0; }
  equals(other: GuestCartToken): boolean { return this.hash === other.getHash(); }
  toString(): string { return this.hash; }
}
