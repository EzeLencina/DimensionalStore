export type ProductVisibilityValue = 'PUBLIC' | 'PRIVATE' | 'HIDDEN';

const VALID_VISIBILITIES: ProductVisibilityValue[] = ['PUBLIC', 'PRIVATE', 'HIDDEN'];

export class ProductVisibility {
  private readonly value: ProductVisibilityValue;

  constructor(value: ProductVisibilityValue) {
    if (!VALID_VISIBILITIES.includes(value)) {
      throw new Error(`Invalid product visibility: ${value}`);
    }
    this.value = value;
    Object.freeze(this);
  }

  getValue(): ProductVisibilityValue { return this.value; }
  equals(other: ProductVisibility): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }

  static PUBLIC = new ProductVisibility('PUBLIC');
  static PRIVATE = new ProductVisibility('PRIVATE');
  static HIDDEN = new ProductVisibility('HIDDEN');

  static fromString(value: string): ProductVisibility {
    const upper = value.toUpperCase() as ProductVisibilityValue;
    if (!VALID_VISIBILITIES.includes(upper)) {
      throw new Error(`Invalid product visibility: ${value}`);
    }
    return new ProductVisibility(upper);
  }
}
