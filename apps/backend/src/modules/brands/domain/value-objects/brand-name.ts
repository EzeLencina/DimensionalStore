const MAX_NAME_LENGTH = 150;

export class BrandName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): BrandName {
    const trimmed = value.trim().replace(/\s+/g, ' ');
    if (!trimmed || trimmed.length === 0) {
      throw new Error('Brand name cannot be empty');
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new Error(`Brand name cannot exceed ${MAX_NAME_LENGTH} characters`);
    }
    return new BrandName(trimmed);
  }

  getValue(): string { return this.value; }
  toString(): string { return this.value; }
  equals(other: BrandName): boolean { return this.value === other.value; }
}
