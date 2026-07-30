import { PRODUCTS_CONSTANTS } from '../../constants';

export class SeoDescription {
  private readonly value: string | null;

  constructor(value: string | null | undefined) {
    if (value === null || value === undefined) {
      this.value = null;
    } else {
      const normalized = value.trim();
      if (normalized.length > PRODUCTS_CONSTANTS.SEO_DESCRIPTION_MAX_LENGTH) {
        throw new Error(`SEO description must be at most ${PRODUCTS_CONSTANTS.SEO_DESCRIPTION_MAX_LENGTH} characters`);
      }
      this.value = normalized;
    }
    Object.freeze(this);
  }

  getValue(): string | null { return this.value; }
  equals(other: SeoDescription): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value ?? ''; }
}
