import { MFA_CONSTANTS } from '../../constants';

export class TotpSecret {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TOTP secret cannot be empty');
    }
    const clean = value.replace(/\s/g, '').toUpperCase();
    if (clean.length < 16) {
      throw new Error('TOTP secret too short — must be at least 16 base32 chars');
    }
    if (!/^[A-Z2-7]+=*$/.test(clean)) {
      throw new Error('TOTP secret must be valid base32');
    }
    this.value = clean;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TotpSecret): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
