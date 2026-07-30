import { createHash, randomBytes } from 'node:crypto';

export class GuestWishlistToken {
  private readonly token: string;
  private readonly hash: string;

  constructor(token?: string) {
    this.token = token ?? randomBytes(32).toString('hex');
    this.hash = createHash('sha256').update(this.token).digest('hex');
    Object.freeze(this);
  }

  getToken(): string { return this.token; }
  getHash(): string { return this.hash; }
  toString(): string { return this.token; }
}
