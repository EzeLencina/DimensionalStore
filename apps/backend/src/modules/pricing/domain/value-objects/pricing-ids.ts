export class PriceListId {
  private readonly value: string;
  constructor(value?: string) {
    if (value !== undefined && (typeof value !== 'string' || value.trim().length === 0)) throw new Error('PriceListId must be a non-empty string');
    this.value = value ?? crypto.randomUUID();
    Object.freeze(this);
  }
  getValue(): string { return this.value; }
  equals(other: PriceListId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}

export class VariantPriceId {
  private readonly value: string;
  constructor(value?: string) {
    if (value !== undefined && (typeof value !== 'string' || value.trim().length === 0)) throw new Error('VariantPriceId must be a non-empty string');
    this.value = value ?? crypto.randomUUID();
    Object.freeze(this);
  }
  getValue(): string { return this.value; }
  equals(other: VariantPriceId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
