import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import {
  OrderPaymentConfirmedEvent, OrderPaymentFailedEvent,
  OrderProcessingStartedEvent, OrderReadyForPickupEvent,
  OrderShippedEvent, OrderDeliveredEvent,
  OrderCancelledEvent, OrderExpiredEvent,
  OrderNoteAddedEvent,
} from '../domain/events';

@Injectable()
export class OrderEventHandler {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: any) {}

  handlePaymentConfirmed(event: OrderPaymentConfirmedEvent): void {
    this.logger.info({ event: event.eventName, orderId: event.orderId, tenantId: event.tenantId }, 'Order payment confirmed');
  }

  handlePaymentFailed(event: OrderPaymentFailedEvent): void {
    this.logger.warn({ event: event.eventName, orderId: event.orderId, tenantId: event.tenantId, reason: event.reason }, 'Order payment failed');
  }

  handleProcessingStarted(event: OrderProcessingStartedEvent): void {
    this.logger.info({ event: event.eventName, orderId: event.orderId, tenantId: event.tenantId }, 'Order processing started');
  }

  handleReadyForPickup(event: OrderReadyForPickupEvent): void {
    this.logger.info({ event: event.eventName, orderId: event.orderId, tenantId: event.tenantId }, 'Order ready for pickup');
  }

  handleShipped(event: OrderShippedEvent): void {
    this.logger.info({ event: event.eventName, orderId: event.orderId, tenantId: event.tenantId, carrier: event.carrierCode }, 'Order shipped');
  }

  handleDelivered(event: OrderDeliveredEvent): void {
    this.logger.info({ event: event.eventName, orderId: event.orderId, tenantId: event.tenantId }, 'Order delivered');
  }

  handleCancelled(event: OrderCancelledEvent): void {
    this.logger.info({ event: event.eventName, orderId: event.orderId, tenantId: event.tenantId, reason: event.reason }, 'Order cancelled');
  }

  handleExpired(event: OrderExpiredEvent): void {
    this.logger.info({ event: event.eventName, orderId: event.orderId, tenantId: event.tenantId }, 'Order expired');
  }

  handleNoteAdded(event: OrderNoteAddedEvent): void {
    this.logger.info({ event: event.eventName, orderId: event.orderId, visibility: event.visibility }, 'Order note added');
  }
}
