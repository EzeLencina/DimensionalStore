export type ProductStatusValue = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

const VALID_STATUSES: ProductStatusValue[] = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

const VALID_TRANSITIONS: Record<ProductStatusValue, ProductStatusValue[]> = {
  DRAFT: ['ACTIVE', 'ARCHIVED'],
  ACTIVE: ['INACTIVE', 'ARCHIVED'],
  INACTIVE: ['ACTIVE', 'ARCHIVED'],
  ARCHIVED: ['DRAFT'],
};

export class ProductStatus {
  private readonly value: ProductStatusValue;

  constructor(value: ProductStatusValue) {
    if (!VALID_STATUSES.includes(value)) {
      throw new Error(`Invalid product status: ${value}`);
    }
    this.value = value;
    Object.freeze(this);
  }

  getValue(): ProductStatusValue { return this.value; }

  canTransitionTo(target: ProductStatusValue): boolean {
    return VALID_TRANSITIONS[this.value]?.includes(target) ?? false;
  }

  equals(other: ProductStatus): boolean { return this.value === other.getValue(); }

  toString(): string { return this.value; }

  static DRAFT = new ProductStatus('DRAFT');
  static ACTIVE = new ProductStatus('ACTIVE');
  static INACTIVE = new ProductStatus('INACTIVE');
  static ARCHIVED = new ProductStatus('ARCHIVED');

  static fromString(value: string): ProductStatus {
    const upper = value.toUpperCase() as ProductStatusValue;
    if (!VALID_STATUSES.includes(upper)) {
      throw new Error(`Invalid product status: ${value}`);
    }
    return new ProductStatus(upper);
  }
}
