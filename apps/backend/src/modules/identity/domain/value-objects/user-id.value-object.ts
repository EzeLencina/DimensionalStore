import { IdentityException } from '../exceptions/identity.exception';

export class UserId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new IdentityException('USER_ID_INVALID', 'UserId cannot be empty');
    }
    this.value = value.trim();
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
