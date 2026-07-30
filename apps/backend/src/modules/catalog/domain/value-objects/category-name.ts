const MAX_NAME_LENGTH = 150;
const MIN_NAME_LENGTH = 1;

export class CategoryName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): CategoryName {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < MIN_NAME_LENGTH) {
      throw new Error('Category name cannot be empty');
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new Error(`Category name cannot exceed ${MAX_NAME_LENGTH} characters`);
    }
    return new CategoryName(trimmed);
  }

  getValue(): string { return this.value; }
  toString(): string { return this.value; }
  equals(other: CategoryName): boolean { return this.value === other.value; }
}
