import { CustomerAppService } from '../services';
import { InMemoryCustomerRepository, InMemoryCustomerAddressRepository, InMemoryCustomerTagRepository, InMemoryCustomerNoteRepository } from '../infrastructure';
import { CreateCustomerCommand, UpdateCustomerProfileCommand, CreateCustomerTagCommand, AssignCustomerTagCommand, AddCustomerNoteCommand, RecalculateCustomerMetricsCommand } from '../application/commands';

describe('CustomerAppService', () => {
  let service: CustomerAppService;
  let customerRepo: InMemoryCustomerRepository;

  beforeEach(() => {
    customerRepo = new InMemoryCustomerRepository();
    const addressRepo = new InMemoryCustomerAddressRepository();
    const tagRepo = new InMemoryCustomerTagRepository();
    const noteRepo = new InMemoryCustomerNoteRepository();
    const userReader = { exists: async () => true };
    const orderReader = { countByCustomer: async () => 2, sumSpentByCustomer: async () => 3000, findOrderTimestampsByCustomer: async () => ({ firstOrderAt: new Date('2026-01-01'), lastOrderAt: new Date('2026-01-02') }) };
    const eventPublisher = { publish: async () => {} };
    const clock = { now: () => new Date() };
    const actor = { getType: () => 'ADMIN', getId: () => 'admin-1' };
    const logger = { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} };
    service = new CustomerAppService(customerRepo as never, addressRepo as never, tagRepo as never, noteRepo as never, userReader as never, orderReader as never, eventPublisher as never, clock as never, actor as never, logger as never);
  });

  it('creates and reads a customer', async () => {
    const customer = await service.createCustomer(new CreateCustomerCommand('tenant-1', 'John@Example.com', 'John', 'Doe'));
    expect(customer.email).toBe('john@example.com');
    expect((await service.getCustomerByEmail('john@example.com', 'tenant-1')).id).toBe(customer.id);
  });

  it('updates profile', async () => {
    const created = await service.createCustomer(new CreateCustomerCommand('tenant-1', 'a@b.com', 'John', 'Doe'));
    const updated = await service.updateCustomerProfile(new UpdateCustomerProfileCommand('tenant-1', created.id, 'Jane', 'Doe', null, null, null));
    expect(updated.firstName).toBe('Jane');
  });

  it('creates tags and notes', async () => {
    const created = await service.createCustomer(new CreateCustomerCommand('tenant-1', 'a@b.com', 'John', 'Doe'));
    const tag = await service.createCustomerTag(new CreateCustomerTagCommand('tenant-1', 'Mayorista', 'mayorista'));
    const assigned = await service.assignCustomerTag(new AssignCustomerTagCommand('tenant-1', created.id, tag.id, 'admin-1'));
    const note = await service.addCustomerNote(new AddCustomerNoteCommand('tenant-1', created.id, 'VIP', 'admin-1'));
    expect(assigned.tags).toHaveLength(1);
    expect(note.content).toBe('VIP');
  });

  it('recalculates metrics from orders', async () => {
    const created = await service.createCustomer(new CreateCustomerCommand('tenant-1', 'a@b.com', 'John', 'Doe'));
    const recalculated = await service.recalculateCustomerMetrics(new RecalculateCustomerMetricsCommand('tenant-1', created.id));
    expect(recalculated.totalOrders).toBe(2);
    expect(recalculated.averageOrderValue).toBe(1500);
  });
});
