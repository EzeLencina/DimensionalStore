import { randomUUID } from 'node:crypto';

export class TokenId {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TokenId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
