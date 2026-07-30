import { createHash } from 'node:crypto';
export class TrackingNumber {
  private readonly value: string;
  constructor(value: string) {
    if (!value?.trim()) throw new Error('Tracking number is required');
    if (value.trim().length > 100) throw new Error('Tracking number too long (max 100)');
    this.value = value.trim();
    Object.freeze(this);
  }
  getValue(): string { return this.value; }
  getSafeHash(): string { return createHash('sha256').update(this.value).digest('hex').slice(0, 16); }
  equals(other: TrackingNumber): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
