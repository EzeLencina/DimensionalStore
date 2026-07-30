import { IdentityException } from '../exceptions/identity.exception';

export class BranchId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new IdentityException('BRANCH_ID_INVALID', 'BranchId cannot be empty');
    }
    this.value = value.trim();
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BranchId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
