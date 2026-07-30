import { PRODUCTS_CONSTANTS } from '../../constants';

export class ProductDescription {
  private readonly value: string | null;

  constructor(value: string | null | undefined) {
    if (value === null || value === undefined) {
      this.value = null;
    } else {
      const normalized = value.trim();
      if (normalized.length > PRODUCTS_CONSTANTS.DESCRIPTION_MAX_LENGTH) {
        throw new Error(`Description must be at most ${PRODUCTS_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`);
      }
      this.value = normalized;
    }
    Object.freeze(this);
  }

  getValue(): string | null { return this.value; }
  equals(other: ProductDescription): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value ?? ''; }
}
