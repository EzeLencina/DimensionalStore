import { IdentityException } from '../exceptions/identity.exception';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_SLUG_LENGTH = 2;
const MAX_SLUG_LENGTH = 100;

export class Slug {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length < MIN_SLUG_LENGTH || trimmed.length > MAX_SLUG_LENGTH) {
      throw new IdentityException(
        'SLUG_INVALID_LENGTH',
        `Slug must be between ${MIN_SLUG_LENGTH} and ${MAX_SLUG_LENGTH} characters`,
      );
    }
    if (!SLUG_REGEX.test(trimmed)) {
      throw new IdentityException('SLUG_INVALID_FORMAT', 'Slug can only contain lowercase letters, numbers, and hyphens');
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
