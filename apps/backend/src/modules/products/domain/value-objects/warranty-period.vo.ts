import { PRODUCTS_CONSTANTS } from '../../constants';

export class WarrantyPeriod {
  private readonly value: number | null;

  constructor(months: number | null | undefined) {
    if (months === null || months === undefined) {
      this.value = null;
    } else if (!Number.isInteger(months) || months < PRODUCTS_CONSTANTS.WARRANTY_MIN_MONTHS || months > PRODUCTS_CONSTANTS.WARRANTY_MAX_MONTHS) {
      throw new Error(`Warranty must be between ${PRODUCTS_CONSTANTS.WARRANTY_MIN_MONTHS} and ${PRODUCTS_CONSTANTS.WARRANTY_MAX_MONTHS} months`);
    } else {
      this.value = months;
    }
    Object.freeze(this);
  }

  getValue(): number | null { return this.value; }
  equals(other: WarrantyPeriod): boolean { return this.value === other.getValue(); }
}
