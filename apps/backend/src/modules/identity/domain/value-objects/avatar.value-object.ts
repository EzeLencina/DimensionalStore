import { IdentityException } from '../exceptions/identity.exception';

const MAX_AVATAR_URL_LENGTH = 2048;

export class Avatar {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (trimmed.length > MAX_AVATAR_URL_LENGTH) {
      throw new IdentityException('AVATAR_INVALID_LENGTH', `Avatar URL must not exceed ${MAX_AVATAR_URL_LENGTH} characters`);
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Avatar): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
