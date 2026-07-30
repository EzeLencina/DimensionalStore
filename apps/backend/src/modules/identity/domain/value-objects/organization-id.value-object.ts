import { IdentityException } from '../exceptions/identity.exception';

export class OrganizationId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new IdentityException('ORGANIZATION_ID_INVALID', 'OrganizationId cannot be empty');
    }
    this.value = value.trim();
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OrganizationId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
