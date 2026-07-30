import { PRODUCTS_CONSTANTS } from '../../constants';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ProductSlug {
  private readonly value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Product slug is required');
    }
    const normalized = value.trim().toLowerCase();
    if (normalized.length > PRODUCTS_CONSTANTS.SLUG_MAX_LENGTH) {
      throw new Error(`Product slug must be at most ${PRODUCTS_CONSTANTS.SLUG_MAX_LENGTH} characters`);
    }
    if (!SLUG_REGEX.test(normalized)) {
      throw new Error('Product slug must contain only lowercase letters, numbers, and hyphens');
    }
    this.value = normalized;
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: ProductSlug): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
