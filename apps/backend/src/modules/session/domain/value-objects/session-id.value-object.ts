import { randomUUID } from 'node:crypto';

export class SessionId {
  private readonly value: string;

  constructor(value?: string) {
    if (value && value.length > 128) throw new Error('Session ID too long');
    this.value = value ?? randomUUID();
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: SessionId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
