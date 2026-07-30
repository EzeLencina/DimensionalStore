import { IdentityException } from '../exceptions/identity.exception';

const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 50;

export class Username {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (trimmed.length < MIN_USERNAME_LENGTH || trimmed.length > MAX_USERNAME_LENGTH) {
      throw new IdentityException(
        'USERNAME_INVALID_LENGTH',
        `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`,
      );
    }
    if (!USERNAME_REGEX.test(trimmed)) {
      throw new IdentityException('USERNAME_INVALID_FORMAT', 'Username can only contain letters, numbers, dots, hyphens, and underscores');
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Username): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
