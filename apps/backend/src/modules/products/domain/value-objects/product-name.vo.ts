import { PRODUCTS_CONSTANTS } from '../../constants';

export class ProductName {
  private readonly value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Product name is required');
    }
    const normalized = value.trim().replace(/\s+/g, ' ');
    if (normalized.length < PRODUCTS_CONSTANTS.NAME_MIN_LENGTH) {
      throw new Error(`Product name must be at least ${PRODUCTS_CONSTANTS.NAME_MIN_LENGTH} characters`);
    }
    if (normalized.length > PRODUCTS_CONSTANTS.NAME_MAX_LENGTH) {
      throw new Error(`Product name must be at most ${PRODUCTS_CONSTANTS.NAME_MAX_LENGTH} characters`);
    }
    this.value = normalized;
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: ProductName): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
