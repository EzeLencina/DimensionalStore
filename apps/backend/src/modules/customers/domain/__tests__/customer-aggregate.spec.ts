import { Customer, CustomerAddress, CustomerPreferences, CustomerTag, CustomerNote } from '..';

describe('Customer Aggregate', () => {
  it('creates with normalized email and active status', () => {
    const customer = Customer.create({ tenantId: 'tenant-1', email: 'Test@Email.com', firstName: 'John', lastName: 'Doe' });
    expect(customer.getEmail()).toBe('test@email.com');
    expect(customer.getStatus().toString()).toBe('ACTIVE');
  });

  it('can block and restore', () => {
    const customer = Customer.create({ tenantId: 'tenant-1', email: 'a@b.com', firstName: 'John', lastName: 'Doe' });
    customer.block();
    expect(customer.getStatus().toString()).toBe('BLOCKED');
    customer.unblock();
    expect(customer.getStatus().toString()).toBe('ACTIVE');
  });

  it('updates commercial metrics', () => {
    const customer = Customer.create({ tenantId: 'tenant-1', email: 'a@b.com', firstName: 'John', lastName: 'Doe' });
    customer.updateCommercialMetrics(2, 3000, new Date('2026-01-01'), new Date('2026-01-02'));
    expect(customer.toPrimitives().averageOrderValue).toBe(1500);
  });

  it('manages addresses, tags and notes', () => {
    const customer = Customer.create({ tenantId: 'tenant-1', email: 'a@b.com', firstName: 'John', lastName: 'Doe' });
    customer.addAddress(new CustomerAddress('tenant-1', customer.getId().toString(), 'SHIPPING', null, 'John Doe', null, 'Main', '123', null, 'City', 'Prov', '1000', 'AR', null, true, false));
    customer.addTag(new CustomerTag('tenant-1', 'Mayorista', 'mayorista', null));
    customer.addInternalNote(new CustomerNote('tenant-1', customer.getId().toString(), 'VIP', 'admin'));
    expect(customer.getAddresses()).toHaveLength(1);
    expect(customer.getTags()).toHaveLength(1);
    expect(customer.getNotes()).toHaveLength(1);
  });
});
