export type CustomerSourceValue = 'WEB' | 'ADMIN' | 'GUEST_CHECKOUT' | 'IMPORT' | 'MERCADO_LIBRE' | 'TIENDANUBE' | 'WOOCOMMERCE' | 'MANUAL';

const VALID: CustomerSourceValue[] = ['WEB', 'ADMIN', 'GUEST_CHECKOUT', 'IMPORT', 'MERCADO_LIBRE', 'TIENDANUBE', 'WOOCOMMERCE', 'MANUAL'];

export class CustomerSource {
  private readonly value: CustomerSourceValue;
  private constructor(value: CustomerSourceValue) { this.value = value; Object.freeze(this); }
  static create(value: string): CustomerSource {
    const upper = value.toUpperCase() as CustomerSourceValue;
    if (!VALID.includes(upper)) throw new Error(`Invalid customer source: ${value}`);
    return new CustomerSource(upper);
  }
  static WEB(): CustomerSource { return new CustomerSource('WEB'); }
  toString(): string { return this.value; }
}
