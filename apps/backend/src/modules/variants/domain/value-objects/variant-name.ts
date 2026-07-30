const MAX_NAME_LENGTH = 200;

export class VariantName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): VariantName {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Variant name cannot be empty');
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new Error(`Variant name cannot exceed ${MAX_NAME_LENGTH} characters`);
    }
    return new VariantName(trimmed);
  }

  getValue(): string { return this.value; }
  toString(): string { return this.value; }
  equals(other: VariantName): boolean { return this.value === other.value; }
}
