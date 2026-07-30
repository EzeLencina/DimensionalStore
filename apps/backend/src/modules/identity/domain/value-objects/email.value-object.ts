import { IdentityException } from '../exceptions/identity.exception';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export class Email {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || trimmed.length > MAX_EMAIL_LENGTH) {
      throw new IdentityException('EMAIL_INVALID_LENGTH', `Email must be between 1 and ${MAX_EMAIL_LENGTH} characters`);
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new IdentityException('EMAIL_INVALID_FORMAT', 'Email format is invalid');
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split('@')[1] ?? '';
  }

  getLocalPart(): string {
    return this.value.split('@')[0] ?? '';
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
