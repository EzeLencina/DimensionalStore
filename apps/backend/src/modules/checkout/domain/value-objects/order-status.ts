export type OrderStatusValue =
  | 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED' | 'PAYMENT_FAILED'
  | 'PROCESSING' | 'READY_FOR_PICKUP'
  | 'SHIPPED' | 'DELIVERED'
  | 'CANCELLED' | 'EXPIRED'
  | 'PARTIALLY_CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED'
  | 'REFUNDED' | 'PARTIALLY_REFUNDED';

const VALID: OrderStatusValue[] = [
  'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'PAYMENT_FAILED',
  'PROCESSING', 'READY_FOR_PICKUP', 'SHIPPED', 'DELIVERED',
  'CANCELLED', 'EXPIRED',
  'PARTIALLY_CANCELLED', 'RETURN_REQUESTED', 'RETURNED',
  'REFUNDED', 'PARTIALLY_REFUNDED',
];

const TERMINAL: OrderStatusValue[] = ['DELIVERED', 'CANCELLED', 'EXPIRED', 'REFUNDED'];

const TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING_PAYMENT: ['PAYMENT_CONFIRMED', 'PAYMENT_FAILED', 'CANCELLED', 'EXPIRED'],
  PAYMENT_FAILED: ['PENDING_PAYMENT', 'CANCELLED', 'EXPIRED'],
  PAYMENT_CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['READY_FOR_PICKUP', 'SHIPPED', 'CANCELLED'],
  READY_FOR_PICKUP: ['DELIVERED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  EXPIRED: [],
  PARTIALLY_CANCELLED: [],
  RETURN_REQUESTED: [],
  RETURNED: [],
  REFUNDED: [],
  PARTIALLY_REFUNDED: [],
};

export class OrderStatus {
  private readonly value: OrderStatusValue;
  private constructor(value: OrderStatusValue) { this.value = value; Object.freeze(this); }

  static create(v: string): OrderStatus {
    const upper = v.toUpperCase() as OrderStatusValue;
    if (!VALID.includes(upper)) throw new Error(`Invalid order status: ${v}`);
    return new OrderStatus(upper);
  }

  static PENDING_PAYMENT(): OrderStatus { return new OrderStatus('PENDING_PAYMENT'); }
  static PAYMENT_CONFIRMED(): OrderStatus { return new OrderStatus('PAYMENT_CONFIRMED'); }
  static PAYMENT_FAILED(): OrderStatus { return new OrderStatus('PAYMENT_FAILED'); }
  static PROCESSING(): OrderStatus { return new OrderStatus('PROCESSING'); }
  static READY_FOR_PICKUP(): OrderStatus { return new OrderStatus('READY_FOR_PICKUP'); }
  static SHIPPED(): OrderStatus { return new OrderStatus('SHIPPED'); }
  static DELIVERED(): OrderStatus { return new OrderStatus('DELIVERED'); }
  static CANCELLED(): OrderStatus { return new OrderStatus('CANCELLED'); }
  static EXPIRED(): OrderStatus { return new OrderStatus('EXPIRED'); }

  getValue(): OrderStatusValue { return this.value; }
  isTerminal(): boolean { return TERMINAL.includes(this.value); }
  canTransitionTo(target: OrderStatusValue): boolean {
    return TRANSITIONS[this.value]?.includes(target) ?? false;
  }
  equals(other: OrderStatus): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
