import { randomUUID } from 'node:crypto';

export class ServiceAccountId {
  private readonly value: string;

  constructor(value?: string) {
    if (value && (typeof value !== 'string' || value.trim().length === 0)) {
      throw new Error('ServiceAccountId must be a non-empty string');
    }
    this.value = value ?? randomUUID();
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: ServiceAccountId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
