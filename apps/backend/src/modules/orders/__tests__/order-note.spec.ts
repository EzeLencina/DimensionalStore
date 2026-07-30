import { OrderNote } from '../domain/aggregates';
import { OrderException } from '../domain/exceptions';

describe('OrderNote', () => {
  it('should create internal note', () => {
    const note = OrderNote.create({ tenantId: 't1', orderId: 'o1', content: 'Internal note', visibility: 'INTERNAL', createdBy: 'admin' });
    expect(note.getVisibility()).toBe('INTERNAL');
    expect(note.isCustomerVisible()).toBe(false);
  });

  it('should create customer-visible note', () => {
    const note = OrderNote.create({ tenantId: 't1', orderId: 'o1', content: 'Visible note', visibility: 'CUSTOMER_VISIBLE', createdBy: 'admin' });
    expect(note.isCustomerVisible()).toBe(true);
  });

  it('should default to INTERNAL', () => {
    const note = OrderNote.create({ tenantId: 't1', orderId: 'o1', content: 'Default note', createdBy: 'admin' });
    expect(note.getVisibility()).toBe('INTERNAL');
  });

  it('should reject empty content', () => {
    expect(() => OrderNote.create({ tenantId: 't1', orderId: 'o1', content: '', createdBy: 'admin' })).toThrow(OrderException);
  });

  it('should reject invalid visibility', () => {
    expect(() => OrderNote.create({ tenantId: 't1', orderId: 'o1', content: 'test', visibility: 'INVALID', createdBy: 'admin' })).toThrow(OrderException);
  });

  it('should soft delete', () => {
    const note = OrderNote.create({ tenantId: 't1', orderId: 'o1', content: 'test', createdBy: 'admin' });
    expect(note.isDeleted()).toBe(false);
    note.softDelete(new Date());
    expect(note.isDeleted()).toBe(true);
  });

  it('should create from primitives', () => {
    const note = OrderNote.create({ tenantId: 't1', orderId: 'o1', content: 'test', createdBy: 'admin' });
    const p = note.toPrimitives();
    const restored = OrderNote.fromPrimitives(p);
    expect(restored.getId()).toBe(note.getId());
    expect(restored.getContent()).toBe('test');
  });
});
