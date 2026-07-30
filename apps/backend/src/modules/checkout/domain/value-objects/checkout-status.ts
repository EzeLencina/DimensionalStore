export type CheckoutStatusValue = 'OPEN' | 'VALIDATING' | 'READY' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED' | 'FAILED';
const VALID: CheckoutStatusValue[] = ['OPEN', 'VALIDATING', 'READY', 'COMPLETED', 'EXPIRED', 'CANCELLED', 'FAILED'];

export class CheckoutStatus {
  private readonly value: CheckoutStatusValue;
  private constructor(value: CheckoutStatusValue) { this.value = value; Object.freeze(this); }
  static create(v: string): CheckoutStatus {
    const upper = v.toUpperCase() as CheckoutStatusValue;
    if (!VALID.includes(upper)) throw new Error(`Invalid checkout status: ${v}`);
    return new CheckoutStatus(upper);
  }
  static OPEN(): CheckoutStatus { return new CheckoutStatus('OPEN'); }
  static VALIDATING(): CheckoutStatus { return new CheckoutStatus('VALIDATING'); }
  static READY(): CheckoutStatus { return new CheckoutStatus('READY'); }
  static COMPLETED(): CheckoutStatus { return new CheckoutStatus('COMPLETED'); }
  static EXPIRED(): CheckoutStatus { return new CheckoutStatus('EXPIRED'); }
  static CANCELLED(): CheckoutStatus { return new CheckoutStatus('CANCELLED'); }
  static FAILED(): CheckoutStatus { return new CheckoutStatus('FAILED'); }
  getValue(): CheckoutStatusValue { return this.value; }
  isModifiable(): boolean { return this.value === 'OPEN' || this.value === 'VALIDATING' || this.value === 'READY'; }
  canTransitionTo(target: CheckoutStatusValue): boolean {
    const transitions: Record<CheckoutStatusValue, CheckoutStatusValue[]> = {
      OPEN: ['VALIDATING', 'READY', 'CANCELLED', 'EXPIRED', 'FAILED'],
      VALIDATING: ['READY', 'FAILED', 'CANCELLED'],
      READY: ['COMPLETED', 'CANCELLED', 'FAILED'],
      COMPLETED: [],
      EXPIRED: [],
      CANCELLED: [],
      FAILED: [],
    };
    return transitions[this.value]?.includes(target) ?? false;
  }
  toString(): string { return this.value; }
}
