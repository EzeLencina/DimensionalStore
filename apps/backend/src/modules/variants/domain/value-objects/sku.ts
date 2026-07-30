const SKU_REGEX = /^[A-Z0-9][A-Z0-9_-]*[A-Z0-9]$|^[A-Z0-9]$/;
const MAX_SKU_LENGTH = 50;

export class SKU {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): SKU {
    const normalized = value.toUpperCase().trim().replace(/\s+/g, '');
    if (!normalized) {
      throw new Error('SKU cannot be empty');
    }
    if (normalized.length > MAX_SKU_LENGTH) {
      throw new Error(`SKU cannot exceed ${MAX_SKU_LENGTH} characters`);
    }
    if (!SKU_REGEX.test(normalized)) {
      throw new Error(
        'SKU must contain only letters, numbers, hyphens, and underscores',
      );
    }
    return new SKU(normalized);
  }

  getValue(): string { return this.value; }
  toString(): string { return this.value; }
  equals(other: SKU): boolean { return this.value === other.value; }
}
