const MAX_SHORT_DESCRIPTION_LENGTH = 500;

export class ShortDescription {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): ShortDescription {
    const trimmed = value.trim();
    if (trimmed.length > MAX_SHORT_DESCRIPTION_LENGTH) {
      throw new Error(`Short description cannot exceed ${MAX_SHORT_DESCRIPTION_LENGTH} characters`);
    }
    return new ShortDescription(trimmed);
  }

  static empty(): ShortDescription {
    return new ShortDescription('');
  }

  getValue(): string { return this.value; }
  isEmpty(): boolean { return this.value.length === 0; }
  toString(): string { return this.value; }
  equals(other: ShortDescription): boolean { return this.value === other.value; }
}
