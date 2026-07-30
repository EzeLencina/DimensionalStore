const MAX_DESCRIPTION_LENGTH = 5000;

export class Description {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): Description {
    const trimmed = value.trim();
    if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`);
    }
    return new Description(trimmed);
  }

  static empty(): Description {
    return new Description('');
  }

  getValue(): string { return this.value; }
  isEmpty(): boolean { return this.value.length === 0; }
  toString(): string { return this.value; }
  equals(other: Description): boolean { return this.value === other.value; }
}
