export type ProductConditionValue = 'NEW' | 'REFURBISHED' | 'USED';

const VALID_CONDITIONS: ProductConditionValue[] = ['NEW', 'REFURBISHED', 'USED'];

export class ProductCondition {
  private readonly value: ProductConditionValue;

  constructor(value: ProductConditionValue) {
    if (!VALID_CONDITIONS.includes(value)) {
      throw new Error(`Invalid product condition: ${value}`);
    }
    this.value = value;
    Object.freeze(this);
  }

  getValue(): ProductConditionValue { return this.value; }
  equals(other: ProductCondition): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }

  static NEW = new ProductCondition('NEW');
  static REFURBISHED = new ProductCondition('REFURBISHED');
  static USED = new ProductCondition('USED');

  static fromString(value: string): ProductCondition {
    const upper = value.toUpperCase() as ProductConditionValue;
    if (!VALID_CONDITIONS.includes(upper)) {
      throw new Error(`Invalid product condition: ${value}`);
    }
    return new ProductCondition(upper);
  }
}
