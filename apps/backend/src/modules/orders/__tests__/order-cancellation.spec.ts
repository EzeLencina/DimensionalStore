import { OrderCancellation } from '../domain/aggregates';

describe('OrderCancellation', () => {
  it('should create full cancellation', () => {
    const c = OrderCancellation.create({
      tenantId: 't1', orderId: 'o1', reasonCode: 'CUSTOMER_REQUEST',
      requestedByType: 'ADMIN', requestedById: 'user-1',
    });
    expect(c.getReasonCode()).toBe('CUSTOMER_REQUEST');
    expect(c.getStatus()).toBe('COMPLETED');
  });

  it('should create from primitives', () => {
    const c = OrderCancellation.create({
      tenantId: 't1', orderId: 'o1', reasonCode: 'OUT_OF_STOCK',
      reasonText: 'Item not available', requestedByType: 'SYSTEM',
    });
    const p = c.toPrimitives();
    const restored = OrderCancellation.fromPrimitives(p);
    expect(restored.getId()).toBe(c.getId());
    expect(restored.getReasonCode()).toBe('OUT_OF_STOCK');
  });
});
