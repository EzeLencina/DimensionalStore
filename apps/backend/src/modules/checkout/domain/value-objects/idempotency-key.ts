import { createHash } from 'node:crypto';

export class IdempotencyKey {
  private readonly key: string;
  private readonly payloadHash: string;
  constructor(key: string, payload: string) {
    if (!key?.trim()) throw new Error('IdempotencyKey is required');
    this.key = key.trim();
    this.payloadHash = createHash('sha256').update(payload).digest('hex');
    Object.freeze(this);
  }
  getKey(): string { return this.key; }
  getPayloadHash(): string { return this.payloadHash; }
  equals(other: IdempotencyKey): boolean { return this.key === other.getKey() && this.payloadHash === other.getPayloadHash(); }
  toString(): string { return this.key; }
}
