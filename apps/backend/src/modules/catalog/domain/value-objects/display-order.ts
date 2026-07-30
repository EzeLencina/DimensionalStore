export class DisplayOrder {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: number): DisplayOrder {
    const intValue = Math.floor(value);
    if (intValue < 0) {
      throw new Error('Display order cannot be negative');
    }
    if (intValue > 999999) {
      throw new Error('Display order cannot exceed 999999');
    }
    return new DisplayOrder(intValue);
  }

  static default(): DisplayOrder {
    return new DisplayOrder(0);
  }

  getValue(): number { return this.value; }
  toString(): string { return String(this.value); }
  equals(other: DisplayOrder): boolean { return this.value === other.value; }
}
