import { randomUUID } from 'node:crypto';

export class ChallengeId {
  private readonly value: string;

  constructor(value?: string) {
    if (value && typeof value !== 'string') {
      throw new Error('Challenge ID must be a string');
    }
    if (value && value.trim().length === 0) {
      throw new Error('Challenge ID cannot be empty');
    }
    this.value = value ?? randomUUID();
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ChallengeId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
