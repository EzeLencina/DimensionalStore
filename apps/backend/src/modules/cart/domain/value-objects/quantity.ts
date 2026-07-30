export class Quantity {
  private readonly value: number;
  private constructor(value: number) { this.value = value; Object.freeze(this); }

  static create(value: number): Quantity {
    if (!Number.isInteger(value)) throw new Error('Quantity must be an integer');
    if (value < 1) throw new Error('Quantity must be greater than zero');
    if (value > 999999) throw new Error('Quantity exceeds maximum');
    return new Quantity(value);
  }

  getValue(): number { return this.value; }
  add(other: Quantity): Quantity { return Quantity.create(this.value + other.value); }
  subtract(other: Quantity): Quantity { return Quantity.create(this.value - other.value); }
  equals(other: Quantity): boolean { return this.value === other.getValue(); }
  toString(): number { return this.value; }
}
