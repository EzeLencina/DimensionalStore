import { IdentityException } from '../exceptions/identity.exception';

const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

export class Phone {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim().replace(/[\s-()]/g, '');
    if (!PHONE_REGEX.test(trimmed)) {
      throw new IdentityException('PHONE_INVALID_FORMAT', 'Phone must be a valid international phone number (e.g., +5491123456789)');
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  getCountryCode(): string {
    const digits = this.value.replace(/\D/g, '');
    if (digits.startsWith('+')) {
      return digits.slice(0, 3);
    }
    return '';
  }

  equals(other: Phone): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
