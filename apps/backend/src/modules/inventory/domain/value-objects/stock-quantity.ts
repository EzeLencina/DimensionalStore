export class StockQuantity {
  private readonly value: number;
  private constructor(value: number) { this.value = value; Object.freeze(this); }

  static create(value: number): StockQuantity {
    if (!Number.isInteger(value)) throw new Error('Stock quantity must be an integer');
    if (value < 0) throw new Error('Stock quantity cannot be negative');
    return new StockQuantity(value);
  }

  static zero(): StockQuantity { return new StockQuantity(0); }

  getValue(): number { return this.value; }
  add(other: StockQuantity): StockQuantity { return new StockQuantity(this.value + other.value); }
  subtract(other: StockQuantity): StockQuantity {
    const result = this.value - other.value;
    if (result < 0) throw new Error('Insufficient stock');
    return new StockQuantity(result);
  }
  isZero(): boolean { return this.value === 0; }
  toString(): string { return String(this.value); }
  equals(other: StockQuantity): boolean { return this.value === other.value; }
}
