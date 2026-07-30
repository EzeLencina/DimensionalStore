import { IdentityException } from '../exceptions/identity.exception';

const MIN_DISPLAY_NAME_LENGTH = 1;
const MAX_DISPLAY_NAME_LENGTH = 200;

export class DisplayName {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (trimmed.length < MIN_DISPLAY_NAME_LENGTH || trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
      throw new IdentityException(
        'DISPLAY_NAME_INVALID_LENGTH',
        `DisplayName must be between ${MIN_DISPLAY_NAME_LENGTH} and ${MAX_DISPLAY_NAME_LENGTH} characters`,
      );
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: DisplayName): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
