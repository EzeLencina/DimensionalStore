import { IdentityException } from '../exceptions/identity.exception';

export class InvitationId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new IdentityException('INVITATION_ID_INVALID', 'InvitationId cannot be empty');
    }
    this.value = value.trim();
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: InvitationId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
