import { IdentityException } from '../exceptions/identity.exception';

export class PermissionId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new IdentityException('PERMISSION_ID_INVALID', 'PermissionId cannot be empty');
    }
    this.value = value.trim();
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PermissionId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
