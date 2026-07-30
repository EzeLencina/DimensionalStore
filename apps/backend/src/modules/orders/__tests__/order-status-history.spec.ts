import { OrderStatusHistory } from '../domain/aggregates';

describe('OrderStatusHistory', () => {
  it('should create history entry', () => {
    const h = OrderStatusHistory.create({
      tenantId: 't1', orderId: 'o1',
      fromStatus: 'PENDING_PAYMENT', toStatus: 'PAYMENT_CONFIRMED',
      changedByType: 'ADMIN', changedById: 'user-1',
    });
    expect(h.getFromStatus()).toBe('PENDING_PAYMENT');
    expect(h.getToStatus()).toBe('PAYMENT_CONFIRMED');
    expect(h.getTenantId()).toBe('t1');
  });

  it('should be immutable after creation', () => {
    const h = OrderStatusHistory.create({
      tenantId: 't1', orderId: 'o1',
      fromStatus: null, toStatus: 'PENDING_PAYMENT',
      changedByType: 'SYSTEM',
    });
    const p = h.toPrimitives();
    expect(p.fromStatus).toBeNull();
    expect(p.toStatus).toBe('PENDING_PAYMENT');
  });

  it('should create from primitives', () => {
    const h = OrderStatusHistory.create({
      tenantId: 't1', orderId: 'o1',
      fromStatus: 'ACTIVE', toStatus: 'CANCELLED',
      reason: 'Test', changedByType: 'ADMIN',
    });
    const p = h.toPrimitives();
    const restored = OrderStatusHistory.fromPrimitives(p);
    expect(restored.getId()).toBe(h.getId());
    expect(restored.getToStatus()).toBe('CANCELLED');
  });
});
