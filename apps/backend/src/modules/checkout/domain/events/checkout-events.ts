import { DomainEvent } from './domain-event';

export class CheckoutStartedEvent extends DomainEvent {
  constructor(public readonly checkoutId: string, public readonly tenantId: string, public readonly cartId: string) {
    super('checkout.checkout.started');
  }
}
export class CheckoutValidatedEvent extends DomainEvent {
  constructor(public readonly checkoutId: string, public readonly tenantId: string) { super('checkout.checkout.validated'); }
}
export class CheckoutConfirmedEvent extends DomainEvent {
  constructor(public readonly checkoutId: string, public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string) {
    super('checkout.checkout.confirmed');
  }
}
export class CheckoutCancelledEvent extends DomainEvent {
  constructor(public readonly checkoutId: string, public readonly tenantId: string) { super('checkout.checkout.cancelled'); }
}
export class CheckoutExpiredEvent extends DomainEvent {
  constructor(public readonly checkoutId: string, public readonly tenantId: string) { super('checkout.checkout.expired'); }
}
export class OrderCreatedEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string, public readonly total: number) {
    super('checkout.order.created');
  }
}
