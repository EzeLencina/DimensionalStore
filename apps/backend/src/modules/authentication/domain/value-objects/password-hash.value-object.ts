export class PasswordHash {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }
    this.value = value;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PasswordHash): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
