export type ProductTypeValue = 'PHYSICAL' | 'DIGITAL' | 'SERVICE' | 'BUNDLE';

const VALID_TYPES: ProductTypeValue[] = ['PHYSICAL', 'DIGITAL', 'SERVICE', 'BUNDLE'];

export class ProductType {
  private readonly value: ProductTypeValue;

  constructor(value: ProductTypeValue) {
    if (!VALID_TYPES.includes(value)) {
      throw new Error(`Invalid product type: ${value}`);
    }
    this.value = value;
    Object.freeze(this);
  }

  getValue(): ProductTypeValue { return this.value; }
  isPhysical(): boolean { return this.value === 'PHYSICAL'; }
  isDigital(): boolean { return this.value === 'DIGITAL'; }
  isService(): boolean { return this.value === 'SERVICE'; }
  isBundle(): boolean { return this.value === 'BUNDLE'; }
  equals(other: ProductType): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }

  static PHYSICAL = new ProductType('PHYSICAL');
  static DIGITAL = new ProductType('DIGITAL');
  static SERVICE = new ProductType('SERVICE');
  static BUNDLE = new ProductType('BUNDLE');

  static fromString(value: string): ProductType {
    const upper = value.toUpperCase() as ProductTypeValue;
    if (!VALID_TYPES.includes(upper)) {
      throw new Error(`Invalid product type: ${value}`);
    }
    return new ProductType(upper);
  }
}
