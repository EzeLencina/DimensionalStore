import type { CustomerAddress } from '../aggregates';

export const CUSTOMER_ADDRESS_REPOSITORY = 'CUSTOMER_ADDRESS_REPOSITORY';

export interface CustomerAddressRepository {
  save(address: CustomerAddress): Promise<CustomerAddress>;
  findById(id: string, tenantId: string): Promise<CustomerAddress | null>;
  listByCustomer(customerId: string, tenantId: string): Promise<CustomerAddress[]>;
  findDefaultShipping(customerId: string, tenantId: string): Promise<CustomerAddress | null>;
  findDefaultBilling(customerId: string, tenantId: string): Promise<CustomerAddress | null>;
  softDelete(id: string, tenantId: string): Promise<void>;
}
