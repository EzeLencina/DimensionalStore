import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { OrderId, Order } from '../../checkout/domain';
import {
  ORDER_REPOSITORY, ORDER_STATUS_HISTORY_REPOSITORY,
  ORDER_NOTE_REPOSITORY, ORDER_CANCELLATION_REPOSITORY,
} from '../domain/repositories';
import type {
  OrderRepository, OrderStatusHistoryRepository,
  OrderNoteRepository, OrderCancellationRepository, OrderListFilters,
} from '../domain/repositories';
import { OrderStatusHistory, OrderNote, OrderCancellation } from '../domain/aggregates';
import { OrderException, ORDER_ERROR_CODES } from '../domain/exceptions';
import { OrderMapper } from '../application/mappers';
import { OrderValidator } from '../application/validators';
import type { OrderResponseDto, OrderListResponseDto, OrderNoteResponseDto } from '../application/dto';
import type { InventoryReservationService, EventPublisher, Clock, CurrentActor } from '../domain/ports';
import {
  ConfirmPaymentCommand, FailPaymentCommand, RetryPaymentCommand,
  StartProcessingCommand, MarkReadyCommand, MarkShippedCommand,
  MarkDeliveredCommand, CancelOrderCommand, ExpireOrderCommand,
  AddOrderNoteCommand, RemoveOrderNoteCommand,
} from '../application/commands';
import {
  OrderPaymentConfirmedEvent, OrderPaymentFailedEvent,
  OrderProcessingStartedEvent, OrderReadyForPickupEvent,
  OrderShippedEvent, OrderDeliveredEvent,
  OrderCancelledEvent, OrderExpiredEvent,
  OrderNoteAddedEvent,
} from '../domain/events';

@Injectable()
export class OrderAppService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepo: OrderRepository,
    @Inject(ORDER_STATUS_HISTORY_REPOSITORY) private readonly historyRepo: OrderStatusHistoryRepository,
    @Inject(ORDER_NOTE_REPOSITORY) private readonly noteRepo: OrderNoteRepository,
    @Inject(ORDER_CANCELLATION_REPOSITORY) private readonly cancellationRepo: OrderCancellationRepository,
    @Inject('INVENTORY_RESERVATION_SERVICE_ORDERS') private readonly inventoryService: InventoryReservationService,
    @Inject('EVENT_PUBLISHER') private readonly eventPublisher: EventPublisher,
    @Inject('CLOCK_ORDERS') private readonly clock: Clock,
    @Inject('CURRENT_ACTOR') private readonly actor: CurrentActor,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  private getOrderOrThrow(orderId: string, tenantId: string): Promise<Order> {
    return this.getOrderOrThrowWithCheck(orderId, tenantId);
  }

  private async getOrderOrThrowWithCheck(orderId: string, tenantId: string): Promise<Order> {
    const order = await this.orderRepo.findById(new OrderId(orderId), tenantId);
    if (!order) throw new OrderException(ORDER_ERROR_CODES.ORDER_NOT_FOUND, `Order ${orderId} not found`);
    return order;
  }

  private async recordStatusTransition(
    order: Order, reason?: string | null,
    metadata?: Record<string, unknown> | null,
  ): Promise<void> {
    const p = order.toPrimitives();
    const orderId = order.getId().toString();
    const previous = this.lastKnownStatus.get(orderId)
      ?? (await this.historyRepo.listByOrder(orderId, order.getTenantId())).at(-1)?.getToStatus()
      ?? order.getPreviousStatus();
    const fromStatus = previous ?? null;
    const history = OrderStatusHistory.create({
      tenantId: order.getTenantId(),
      orderId: order.getId().toString(),
      fromStatus,
      toStatus: p.status,
      reason: reason ?? null,
      metadata: metadata ?? null,
      changedByType: this.actor.getType(),
      changedById: this.actor.getId(),
    });
    this.lastKnownStatus.set(orderId, p.status);
    await this.historyRepo.append(history);
  }

  private lastKnownStatus = new Map<string, string>();

  // ── Query ──

  async getOrderById(id: string, tenantId: string): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(id, tenantId);
    const [history, notes] = await Promise.all([
      this.historyRepo.listByOrder(id, tenantId),
      this.noteRepo.listByOrder(id, tenantId),
    ]);
    return OrderMapper.toResponse(order, history, notes);
  }

  async getOrderByNumber(orderNumber: string, tenantId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findByOrderNumber(orderNumber, tenantId);
    if (!order) throw new OrderException(ORDER_ERROR_CODES.ORDER_NOT_FOUND, `Order ${orderNumber} not found`);
    const [history, notes] = await Promise.all([
      this.historyRepo.listByOrder(order.getId().toString(), tenantId),
      this.noteRepo.listByOrder(order.getId().toString(), tenantId),
    ]);
    return OrderMapper.toResponse(order, history, notes);
  }

  async listOrders(tenantId: string, filters?: OrderListFilters): Promise<OrderListResponseDto> {
    const result = await this.orderRepo.list(tenantId, filters);
    return {
      items: result.items.map(o => OrderMapper.toResponse(o)),
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    };
  }

  async listCustomerOrders(customerId: string, tenantId: string, filters?: { limit?: number; offset?: number }): Promise<OrderListResponseDto> {
    const result = await this.orderRepo.listByCustomer(customerId, tenantId, filters);
    return {
      items: result.items.map(o => OrderMapper.toResponse(o)),
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    };
  }

  async getOrderHistory(id: string, tenantId: string): Promise<{ orderId: string; history: any[] }> {
    await this.getOrderOrThrow(id, tenantId);
    const history = await this.historyRepo.listByOrder(id, tenantId);
    return { orderId: id, history: history.map(h => OrderMapper.historyToResponse(h)) };
  }

  async getCustomerOrderById(id: string, customerId: string, tenantId: string): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(id, tenantId);
    if (order.getCustomerId() !== customerId) {
      throw new OrderException(ORDER_ERROR_CODES.ORDER_CUSTOMER_MISMATCH, 'Order does not belong to customer');
    }
    const visibleNotes = (await this.noteRepo.listByOrder(id, tenantId)).filter(note => note.isCustomerVisible());
    return OrderMapper.toResponse(order, undefined, visibleNotes);
  }

  // ── Notes ──

  async addNote(command: AddOrderNoteCommand): Promise<OrderNoteResponseDto> {
    const errors = OrderValidator.validateNote(command);
    if (errors.length > 0) throw new OrderException(ORDER_ERROR_CODES.ORDER_INVALID_NOTE_VISIBILITY, errors.join('; '));

    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    const note = OrderNote.create({
      tenantId: command.tenantId,
      orderId: command.orderId,
      content: command.content,
      visibility: command.visibility,
      createdBy: command.createdBy,
    });

    await this.noteRepo.save(note);

    await this.eventPublisher.publish(new OrderNoteAddedEvent(
      command.orderId, note.getId(), command.tenantId, command.visibility,
    ));

    return OrderMapper.noteToResponse(note);
  }

  async removeNote(command: RemoveOrderNoteCommand): Promise<void> {
    const note = await this.noteRepo.findById(command.noteId, command.tenantId);
    if (!note) throw new OrderException(ORDER_ERROR_CODES.ORDER_NOTE_NOT_FOUND, 'Note not found');
    if (note.getOrderId() !== command.orderId) throw new OrderException(ORDER_ERROR_CODES.ORDER_NOTE_FORBIDDEN, 'Note does not belong to order');
    await this.noteRepo.softDelete(command.noteId, command.tenantId);
  }

  // ── Status Transitions ──

  async confirmPayment(command: ConfirmPaymentCommand): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    const now = this.clock.now();

    if (order.getStatus().toString() === 'PAYMENT_CONFIRMED') {
      const [history, notes] = await Promise.all([
        this.historyRepo.listByOrder(command.orderId, command.tenantId),
        this.noteRepo.listByOrder(command.orderId, command.tenantId),
      ]);
      return OrderMapper.toResponse(order, history, notes);
    }

    order.confirmPayment(now);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order);

    await this.eventPublisher.publish(new OrderPaymentConfirmedEvent(
      command.orderId, order.getOrderNumber(), command.tenantId,
    ));

    this.logger.info({ event: 'order.payment_confirmed', orderId: command.orderId, tenantId: command.tenantId }, 'Payment confirmed');
    return OrderMapper.toResponse(order);
  }

  async failPayment(command: FailPaymentCommand): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    const now = this.clock.now();
    order.failPayment(now);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order, command.reason);

    await this.eventPublisher.publish(new OrderPaymentFailedEvent(
      command.orderId, order.getOrderNumber(), command.tenantId, command.reason,
    ));

    return OrderMapper.toResponse(order);
  }

  async retryPayment(command: RetryPaymentCommand): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    const now = this.clock.now();
    order.retryPayment(now);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order, 'Retrying payment');
    return OrderMapper.toResponse(order);
  }

  async startProcessing(command: StartProcessingCommand): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    const now = this.clock.now();
    order.startProcessing(now);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order);

    await this.eventPublisher.publish(new OrderProcessingStartedEvent(
      command.orderId, order.getOrderNumber(), command.tenantId,
    ));

    return OrderMapper.toResponse(order);
  }

  async markReady(command: MarkReadyCommand): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    const now = this.clock.now();
    order.markReady(now);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order);

    await this.eventPublisher.publish(new OrderReadyForPickupEvent(
      command.orderId, order.getOrderNumber(), command.tenantId,
    ));

    return OrderMapper.toResponse(order);
  }

  async markShipped(command: MarkShippedCommand): Promise<OrderResponseDto> {
    const errors = OrderValidator.validateShipping(command);
    if (errors.length > 0) throw new OrderException(ORDER_ERROR_CODES.ORDER_TRACKING_INVALID, errors.join('; '));

    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    const now = this.clock.now();
    order.markShipped(now, command.carrierCode, command.trackingNumber, command.trackingUrl);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order);

    await this.eventPublisher.publish(new OrderShippedEvent(
      command.orderId, order.getOrderNumber(), command.tenantId,
      command.carrierCode, command.trackingNumber,
    ));

    return OrderMapper.toResponse(order);
  }

  async markDelivered(command: MarkDeliveredCommand): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    const now = this.clock.now();
    order.markDelivered(now);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order);

    await this.eventPublisher.publish(new OrderDeliveredEvent(
      command.orderId, order.getOrderNumber(), command.tenantId,
    ));

    return OrderMapper.toResponse(order);
  }

  async cancelOrder(command: CancelOrderCommand): Promise<OrderResponseDto> {
    const errors = OrderValidator.validateCancel(command);
    if (errors.length > 0) throw new OrderException(ORDER_ERROR_CODES.ORDER_NOT_CANCELLABLE, errors.join('; '));

    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);

    const existingCancellation = await this.cancellationRepo.findByOrder(command.orderId, command.tenantId);
    if (existingCancellation) {
      const [history, notes] = await Promise.all([
        this.historyRepo.listByOrder(command.orderId, command.tenantId),
        this.noteRepo.listByOrder(command.orderId, command.tenantId),
      ]);
      return OrderMapper.toResponse(order, history, notes);
    }

    if (order.getStatus().isTerminal()) {
      throw new OrderException(ORDER_ERROR_CODES.ORDER_ALREADY_DELIVERED, `Order cannot be cancelled in ${order.getStatus()}`);
    }

    const now = this.clock.now();
    order.cancel(now, command.reasonText ?? command.reasonCode);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order, command.reasonText ?? command.reasonCode);

    const cancellation = OrderCancellation.create({
      tenantId: command.tenantId,
      orderId: command.orderId,
      reasonCode: command.reasonCode,
      reasonText: command.reasonText,
      requestedByType: this.actor.getType(),
      requestedById: this.actor.getId(),
    });
    await this.cancellationRepo.save(cancellation);

    try {
      await this.inventoryService.releaseReservationsByReference(order.getCheckoutSessionId(), command.tenantId);
    } catch (err: any) {
      this.logger.error({ event: 'order.cancel.reservation_release_failed', orderId: command.orderId, error: err.message },
        'Failed to release reservations');
    }

    await this.eventPublisher.publish(new OrderCancelledEvent(
      command.orderId, order.getOrderNumber(), command.tenantId, command.reasonText,
    ));

    this.logger.info({ event: 'order.cancelled', orderId: command.orderId, tenantId: command.tenantId, reason: command.reasonCode }, 'Order cancelled');
    return OrderMapper.toResponse(order);
  }

  async expireOrder(command: ExpireOrderCommand): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(command.orderId, command.tenantId);
    if (order.getStatus().toString() === 'EXPIRED') return OrderMapper.toResponse(order);
    const now = this.clock.now();
    order.expire(now);
    await this.orderRepo.save(order);
    await this.recordStatusTransition(order, 'Order expired');

    try {
      await this.inventoryService.releaseReservationsByReference(command.orderId, command.tenantId);
    } catch (err: any) {
      this.logger.error({ event: 'order.expire.reservation_release_failed', orderId: command.orderId, error: err.message },
        'Failed to release reservations');
    }

    await this.eventPublisher.publish(new OrderExpiredEvent(
      command.orderId, order.getOrderNumber(), command.tenantId,
    ));

    return OrderMapper.toResponse(order);
  }

  async expirePendingOrders(tenantId: string): Promise<number> {
    const now = this.clock.now();
    const expirationThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const pending = await this.orderRepo.listPendingExpiration(tenantId, expirationThreshold);

    for (const order of pending) {
      try {
        order.expire(now);
        await this.orderRepo.save(order);
        await this.recordStatusTransition(order, 'Auto-expired after 24h');

        try {
          await this.inventoryService.releaseReservationsByReference(order.getCheckoutSessionId(), tenantId);
        } catch { /* continue */ }

        await this.eventPublisher.publish(new OrderExpiredEvent(
          order.getId().toString(), order.getOrderNumber(), tenantId,
        ));
      } catch (err: any) {
        this.logger.error({ event: 'order.auto_expire_failed', orderId: order.getId().toString(), error: err.message },
          'Auto-expire failed');
      }
    }

    return pending.length;
  }
}
