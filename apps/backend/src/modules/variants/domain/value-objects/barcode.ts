const BARCODE_REGEX = /^[0-9]+$/;
const MIN_BARCODE_LENGTH = 8;
const MAX_BARCODE_LENGTH = 48;

export class Barcode {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): Barcode {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Barcode cannot be empty');
    }
    if (trimmed.length < MIN_BARCODE_LENGTH || trimmed.length > MAX_BARCODE_LENGTH) {
      throw new Error(
        `Barcode must be between ${MIN_BARCODE_LENGTH} and ${MAX_BARCODE_LENGTH} digits`,
      );
    }
    if (!BARCODE_REGEX.test(trimmed)) {
      throw new Error('Barcode must contain only digits');
    }
    return new Barcode(trimmed);
  }

  getValue(): string { return this.value; }
  toString(): string { return this.value; }
  equals(other: Barcode): boolean { return this.value === other.value; }
  isEmpty(): boolean { return this.value.length === 0; }
}
