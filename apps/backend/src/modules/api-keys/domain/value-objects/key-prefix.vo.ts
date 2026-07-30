import { API_KEYS_CONSTANTS } from '../../constants';

export class KeyPrefix {
  private readonly value: string;

  constructor(value?: string) {
    const prefix = value ?? API_KEYS_CONSTANTS.KEY_PREFIX;
    if (!prefix || prefix.trim().length === 0) {
      throw new Error('Key prefix cannot be empty');
    }
    if (!/^[a-z][a-z0-9]*$/.test(prefix)) {
      throw new Error('Key prefix must start with a lowercase letter and contain only lowercase alphanumeric');
    }
    if (prefix.length > 16) {
      throw new Error('Key prefix too long (max 16 chars)');
    }
    this.value = prefix;
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: KeyPrefix): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
