export type PriceListTypeValue = 'RETAIL' | 'WHOLESALE' | 'CHANNEL' | 'CUSTOMER_GROUP' | 'PROMOTIONAL';
export type SalesChannelValue = 'WEB' | 'ADMIN' | 'MERCADO_LIBRE' | 'TIENDANUBE' | 'WOOCOMMERCE' | 'MANUAL';

export class PriceListType {
  private readonly value: PriceListTypeValue;
  private constructor(value: PriceListTypeValue) { this.value = value; Object.freeze(this); }
  static create(v: string): PriceListType {
    const valid: PriceListTypeValue[] = ['RETAIL', 'WHOLESALE', 'CHANNEL', 'CUSTOMER_GROUP', 'PROMOTIONAL'];
    const upper = v.toUpperCase() as PriceListTypeValue;
    if (!valid.includes(upper)) throw new Error(`Invalid price list type: ${v}`);
    return new PriceListType(upper);
  }
  getValue(): PriceListTypeValue { return this.value; }
  toString(): string { return this.value; }
}
