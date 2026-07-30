import type { Customer } from '../../../../customers/domain';
import type { CustomerRepository, CustomerListFilters, CustomerListResult } from '../../../../customers/domain/repositories';
import type { CustomerId } from '../../../../customers/domain/value-objects';

export class InMemoryCustomerRepository implements CustomerRepository {
  private store = new Map<string, Customer>();

  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }

  async save(customer: Customer): Promise<Customer> {
    this.store.set(this.key(customer.getId().toString(), customer.getTenantId()), customer);
    return customer;
  }

  async findById(id: CustomerId, tenantId: string): Promise<Customer | null> { return this.store.get(this.key(id.toString(), tenantId)) ?? null; }
  async findByEmail(email: string, tenantId: string): Promise<Customer | null> { return Array.from(this.store.values()).find(c => c.getTenantId() === tenantId && c.getEmail() === email.toLowerCase()) ?? null; }
  async findByUserId(userId: string, tenantId: string): Promise<Customer | null> { return Array.from(this.store.values()).find(c => c.getTenantId() === tenantId && c.getUserId() === userId) ?? null; }
  async existsByEmail(email: string, tenantId: string): Promise<boolean> { return (await this.findByEmail(email, tenantId)) !== null; }
  async list(tenantId: string, filters?: CustomerListFilters): Promise<CustomerListResult> {
    let items = Array.from(this.store.values()).filter(c => c.getTenantId() === tenantId);
    if (filters?.email) items = items.filter(c => c.getEmail() === filters.email!.toLowerCase());
    if (filters?.status) items = items.filter(c => c.getStatus().toString() === filters.status);
    if (filters?.source) items = items.filter(c => c.toPrimitives().source === filters.source);
    if (filters?.minimumTotalSpent !== undefined) items = items.filter(c => c.toPrimitives().totalSpent >= filters.minimumTotalSpent!);
    if (filters?.maximumTotalSpent !== undefined) items = items.filter(c => c.toPrimitives().totalSpent <= filters.maximumTotalSpent!);
    if (filters?.hasOrders !== undefined) items = items.filter(c => (c.toPrimitives().totalOrders > 0) === filters.hasOrders);
    const total = items.length;
    const limit = filters?.limit ?? 20;
    const offset = filters?.offset ?? 0;
    items = items.slice(offset, offset + limit);
    return { items, total, limit, offset };
  }
  async findForUpdate(id: CustomerId, tenantId: string): Promise<Customer | null> { return this.findById(id, tenantId); }
  async countByStatus(tenantId: string): Promise<Record<string, number>> { const counts: Record<string, number> = {}; for (const c of this.store.values()) { if (c.getTenantId() === tenantId) { const k = c.getStatus().toString(); counts[k] = (counts[k] ?? 0) + 1; } } return counts; }
}
