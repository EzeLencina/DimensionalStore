import { randomUUID } from 'node:crypto';

export class ApiKeyId {
  private readonly value: string;

  constructor(value?: string) {
    if (value && (typeof value !== 'string' || value.trim().length === 0)) {
      throw new Error('ApiKeyId must be a non-empty string');
    }
    this.value = value ?? randomUUID();
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: ApiKeyId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
