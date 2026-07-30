import { randomUUID } from 'node:crypto';
export class CheckoutId {
  private readonly value: string;
  constructor(value?: string) {
    if (value !== undefined && (typeof value !== 'string' || value.trim().length === 0)) throw new Error('CheckoutId must be a non-empty string');
    this.value = value ?? randomUUID();
    Object.freeze(this);
  }
  getValue(): string { return this.value; }
  equals(other: CheckoutId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
