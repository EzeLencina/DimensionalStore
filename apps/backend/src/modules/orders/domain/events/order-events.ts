import { DomainEvent } from './order-domain-event';

export class OrderPaymentConfirmedEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string) {
    super('orders.order.payment_confirmed');
  }
}
export class OrderPaymentFailedEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string, public readonly reason?: string) {
    super('orders.order.payment_failed');
  }
}
export class OrderProcessingStartedEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string) {
    super('orders.order.processing_started');
  }
}
export class OrderReadyForPickupEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string) {
    super('orders.order.ready_for_pickup');
  }
}
export class OrderShippedEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string, public readonly carrierCode?: string, public readonly trackingNumber?: string) {
    super('orders.order.shipped');
  }
}
export class OrderDeliveredEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string) {
    super('orders.order.delivered');
  }
}
export class OrderCancelledEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string, public readonly reason?: string) {
    super('orders.order.cancelled');
  }
}
export class OrderExpiredEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly orderNumber: string, public readonly tenantId: string) {
    super('orders.order.expired');
  }
}
export class OrderNoteAddedEvent extends DomainEvent {
  constructor(public readonly orderId: string, public readonly noteId: string, public readonly tenantId: string, public readonly visibility: string) {
    super('orders.order.note_added');
  }
}
