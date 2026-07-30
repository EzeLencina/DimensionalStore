import { API_KEYS_CONSTANTS } from '../../constants';

export class Scope {
  private readonly value: string;
  private readonly resource: string;
  private readonly action: string;
  private readonly wildcard: boolean;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Scope cannot be empty');
    }
    if (value.length > API_KEYS_CONSTANTS.SCOPE_MAX_LENGTH) {
      throw new Error(`Scope too long (max ${API_KEYS_CONSTANTS.SCOPE_MAX_LENGTH} chars)`);
    }

    const parts = value.split(API_KEYS_CONSTANTS.SCOPE_SEPARATOR);
    if (parts.length < 1 || parts.length > 2) {
      throw new Error('Scope must be in format "resource" or "resource.action"');
    }

    const [res, act] = parts;
    if (!res || res.trim().length === 0) {
      throw new Error('Scope resource cannot be empty');
    }

    if (!/^[a-z][a-z0-9]*$/.test(res!)) {
      throw new Error('Scope resource must be lowercase alphanumeric starting with a letter');
    }

    if (act) {
      if (!/^[a-z*][a-z0-9*]*$/.test(act) && act !== '*') {
        throw new Error('Scope action must be lowercase alphanumeric or wildcard');
      }
    }

    this.resource = res!;
    this.action = act ?? '';
    this.wildcard = !act || act === '*';
    this.value = value;
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  getResource(): string { return this.resource; }
  getAction(): string { return this.action; }
  isWildcard(): boolean { return this.wildcard; }

  matches(other: Scope): boolean {
    if (this.resource !== other.getResource() && this.resource !== '*' && other.getResource() !== '*') {
      return false;
    }
    if (this.wildcard || other.isWildcard()) return true;
    return this.action === other.getAction();
  }

  equals(other: Scope): boolean {
    return this.value === other.getValue();
  }

  toString(): string { return this.value; }

  static parse(value: string): Scope {
    return new Scope(value);
  }

  static wildcard(resource: string): Scope {
    return new Scope(`${resource}${API_KEYS_CONSTANTS.SCOPE_SEPARATOR}${API_KEYS_CONSTANTS.SCOPE_WILDCARD}`);
  }
}
