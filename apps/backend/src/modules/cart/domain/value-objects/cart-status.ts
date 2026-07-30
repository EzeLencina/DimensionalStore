export type CartStatusValue = 'ACTIVE' | 'CONVERTED' | 'ABANDONED' | 'EXPIRED' | 'CANCELLED';
const VALID_STATUSES: CartStatusValue[] = ['ACTIVE', 'CONVERTED', 'ABANDONED', 'EXPIRED', 'CANCELLED'];

export class CartStatus {
  private readonly value: CartStatusValue;
  private constructor(value: CartStatusValue) { this.value = value; Object.freeze(this); }
  static create(v: string): CartStatus {
    const upper = v.toUpperCase() as CartStatusValue;
    if (!VALID_STATUSES.includes(upper)) throw new Error(`Invalid cart status: ${v}`);
    return new CartStatus(upper);
  }
  static ACTIVE(): CartStatus { return new CartStatus('ACTIVE'); }
  static CONVERTED(): CartStatus { return new CartStatus('CONVERTED'); }
  static ABANDONED(): CartStatus { return new CartStatus('ABANDONED'); }
  static EXPIRED(): CartStatus { return new CartStatus('EXPIRED'); }
  static CANCELLED(): CartStatus { return new CartStatus('CANCELLED'); }
  getValue(): CartStatusValue { return this.value; }
  equals(other: CartStatus): boolean { return this.value === other.getValue(); }
  isModifiable(): boolean { return this.value === 'ACTIVE'; }
  toString(): string { return this.value; }
}
