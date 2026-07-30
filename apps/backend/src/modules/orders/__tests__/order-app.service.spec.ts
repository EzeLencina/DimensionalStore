import { Order } from '../../checkout/domain';
import { OrderAppService } from '../services';
import { InMemoryOrderRepository } from '../infrastructure/persistence/in-memory/in-memory-order.repository';
import { InMemoryOrderStatusHistoryRepository } from '../infrastructure/persistence/in-memory/in-memory-order-status-history.repository';
import { InMemoryOrderNoteRepository } from '../infrastructure/persistence/in-memory/in-memory-order-note.repository';
import { InMemoryOrderCancellationRepository } from '../infrastructure/persistence/in-memory/in-memory-order-cancellation.repository';
import {
  AddOrderNoteCommand, CancelOrderCommand, ConfirmPaymentCommand,
  MarkShippedCommand, StartProcessingCommand, MarkDeliveredCommand,
} from '../application/commands';
import { OrderException } from '../domain/exceptions';

const tenantId = 'tenant-1';

function makeOrder(customerId = 'customer-1'): Order {
  return Order.create({
    tenantId, orderNumber: `ORD-${Math.random()}`, cartId: 'cart-1', checkoutSessionId: 'checkout-1',
    customerId, currency: 'ARS', subtotal: 10000, shippingAmount: 0,
    discountAmount: 0, taxAmount: 0, total: 10000,
    items: [{ productVariantId: 'variant-1', sku: 'SKU-1', productName: 'Product', variantName: null, quantity: 1, unitPrice: 10000 }],
  });
}

describe('OrderAppService', () => {
  let orders: InMemoryOrderRepository;
  let history: InMemoryOrderStatusHistoryRepository;
  let notes: InMemoryOrderNoteRepository;
  let cancellations: InMemoryOrderCancellationRepository;
  let inventory: { released: string[]; releaseReservationsByReference: jest.Mock };
  let service: OrderAppService;

  beforeEach(async () => {
    orders = new InMemoryOrderRepository();
    history = new InMemoryOrderStatusHistoryRepository();
    notes = new InMemoryOrderNoteRepository();
    cancellations = new InMemoryOrderCancellationRepository();
    inventory = { released: [], releaseReservationsByReference: jest.fn(async (reference: string) => inventory.released.push(reference)) };
    const eventPublisher = { publish: jest.fn(async () => {}) };
    const actor = { getType: () => 'ADMIN', getId: () => 'admin-1' };
    const clock = { now: () => new Date('2026-07-30T12:00:00.000Z') };
    const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    service = new OrderAppService(
      orders as never, history as never, notes as never, cancellations as never,
      inventory as never, eventPublisher as never, clock as never, actor as never, logger as never,
    );
  });

  async function persistOrder(customerId = 'customer-1'): Promise<Order> {
    const order = makeOrder(customerId);
    await orders.save(order);
    return order;
  }

  it('confirms payment and appends immutable history', async () => {
    const order = await persistOrder();
    const result = await service.confirmPayment(new ConfirmPaymentCommand(tenantId, order.getId().toString()));

    expect(result.status).toBe('PAYMENT_CONFIRMED');
    const entries = await history.listByOrder(order.getId().toString(), tenantId);
    expect(entries).toHaveLength(1);
    expect(entries[0].getFromStatus()).toBe('PENDING_PAYMENT');
    expect(entries[0].getToStatus()).toBe('PAYMENT_CONFIRMED');
  });

  it('makes payment confirmation idempotent', async () => {
    const order = await persistOrder();
    const command = new ConfirmPaymentCommand(tenantId, order.getId().toString(), 'payment-key');
    await service.confirmPayment(command);
    const second = await service.confirmPayment(command);

    expect(second.status).toBe('PAYMENT_CONFIRMED');
    expect(await history.listByOrder(order.getId().toString(), tenantId)).toHaveLength(1);
  });

  it('runs processing, shipping and delivery commands', async () => {
    const order = await persistOrder();
    const id = order.getId().toString();
    await service.confirmPayment(new ConfirmPaymentCommand(tenantId, id));
    await service.startProcessing(new StartProcessingCommand(tenantId, id));
    await service.markShipped(new MarkShippedCommand(tenantId, id, 'CORREO', 'TRACK-1', 'https://carrier.test/TRACK-1'));
    const delivered = await service.markDelivered(new MarkDeliveredCommand(tenantId, id));

    expect(delivered.status).toBe('DELIVERED');
    expect(delivered.trackingNumber).toBe('TRACK-1');
    expect((await history.listByOrder(id, tenantId))).toHaveLength(4);
  });

  it('cancels and releases checkout reservations', async () => {
    const order = await persistOrder();
    const result = await service.cancelOrder(new CancelOrderCommand(tenantId, order.getId().toString(), 'CUSTOMER_REQUEST'));

    expect(result.status).toBe('CANCELLED');
    expect(inventory.releaseReservationsByReference).toHaveBeenCalledWith('checkout-1', tenantId);
    expect(await cancellations.findByOrder(order.getId().toString(), tenantId)).not.toBeNull();
  });

  it('does not cancel a delivered order', async () => {
    const order = await persistOrder();
    const id = order.getId().toString();
    await service.confirmPayment(new ConfirmPaymentCommand(tenantId, id));
    await service.startProcessing(new StartProcessingCommand(tenantId, id));
    await service.markShipped(new MarkShippedCommand(tenantId, id));
    await service.markDelivered(new MarkDeliveredCommand(tenantId, id));

    await expect(service.cancelOrder(new CancelOrderCommand(tenantId, id, 'OTHER'))).rejects.toThrow(OrderException);
  });

  it('keeps customer order access tenant and customer scoped', async () => {
    const order = await persistOrder('customer-1');
    await expect(service.getCustomerOrderById(order.getId().toString(), 'customer-2', tenantId)).rejects.toThrow(OrderException);
    await expect(service.getCustomerOrderById(order.getId().toString(), 'customer-1', 'tenant-2')).rejects.toThrow(OrderException);
  });

  it('does not expose internal notes to customers', async () => {
    const order = await persistOrder();
    await service.addNote(new AddOrderNoteCommand(tenantId, order.getId().toString(), 'Private', 'INTERNAL', 'admin-1'));
    await service.addNote(new AddOrderNoteCommand(tenantId, order.getId().toString(), 'Public', 'CUSTOMER_VISIBLE', 'admin-1'));

    const response = await service.getCustomerOrderById(order.getId().toString(), 'customer-1', tenantId);
    expect(response.notes).toHaveLength(1);
    expect(response.notes?.[0].visibility).toBe('CUSTOMER_VISIBLE');
  });

  it('supports customer-visible and internal notes, and soft deletion', async () => {
    const order = await persistOrder();
    const note = await service.addNote(new AddOrderNoteCommand(tenantId, order.getId().toString(), 'Visible update', 'CUSTOMER_VISIBLE', 'admin-1'));
    expect(note.visibility).toBe('CUSTOMER_VISIBLE');

    await service.removeNote({ tenantId, orderId: order.getId().toString(), noteId: note.id });
    expect(await notes.listByOrder(order.getId().toString(), tenantId)).toHaveLength(0);
  });

  it('rejects cross-tenant reads', async () => {
    const order = await persistOrder();
    await expect(service.getOrderById(order.getId().toString(), 'tenant-2')).rejects.toThrow(OrderException);
  });
});
