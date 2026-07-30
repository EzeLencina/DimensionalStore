import { randomUUID } from 'node:crypto';

export class CustomerId {
  private readonly value: string;

  constructor(value?: string) {
    if (value !== undefined && (!value || value.trim().length === 0)) throw new Error('CustomerId cannot be empty');
    this.value = value ?? randomUUID();
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: CustomerId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
