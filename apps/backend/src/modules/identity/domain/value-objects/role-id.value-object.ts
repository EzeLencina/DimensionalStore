import { IdentityException } from '../exceptions/identity.exception';

export class RoleId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new IdentityException('ROLE_ID_INVALID', 'RoleId cannot be empty');
    }
    this.value = value.trim();
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: RoleId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
