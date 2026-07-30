import type { CustomerAddress } from '../../../../customers/domain';
import type { CustomerAddressRepository } from '../../../../customers/domain/repositories';

export class InMemoryCustomerAddressRepository implements CustomerAddressRepository {
  private store = new Map<string, CustomerAddress>();
  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }
  async save(address: CustomerAddress): Promise<CustomerAddress> { this.store.set(this.key(address.getId(), address.getTenantId()), address); return address; }
  async findById(id: string, tenantId: string): Promise<CustomerAddress | null> { return this.store.get(this.key(id, tenantId)) ?? null; }
  async listByCustomer(customerId: string, tenantId: string): Promise<CustomerAddress[]> { return Array.from(this.store.values()).filter(a => a.getTenantId() === tenantId && a.getCustomerId() === customerId); }
  async findDefaultShipping(customerId: string, tenantId: string): Promise<CustomerAddress | null> { return (await this.listByCustomer(customerId, tenantId)).find(a => a.getIsDefaultShipping()) ?? null; }
  async findDefaultBilling(customerId: string, tenantId: string): Promise<CustomerAddress | null> { return (await this.listByCustomer(customerId, tenantId)).find(a => a.getIsDefaultBilling()) ?? null; }
  async softDelete(id: string, tenantId: string): Promise<void> { const a = this.store.get(this.key(id, tenantId)); if (a) a.softDelete(new Date()); }
}
