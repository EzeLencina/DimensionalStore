import type { Customer } from '../aggregates';
import type { CustomerId } from '../value-objects';

export type CustomerListFilters = {
  search?: string; email?: string; phone?: string; status?: string; source?: string; tagId?: string;
  createdFrom?: Date; createdTo?: Date; lastOrderFrom?: Date; lastOrderTo?: Date;
  minimumTotalSpent?: number; maximumTotalSpent?: number; hasOrders?: boolean;
  limit?: number; offset?: number; sortBy?: string; sortOrder?: 'asc' | 'desc';
};

export type CustomerListResult = { items: Customer[]; total: number; limit: number; offset: number };

export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';

export interface CustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findById(id: CustomerId, tenantId: string): Promise<Customer | null>;
  findByEmail(email: string, tenantId: string): Promise<Customer | null>;
  findByUserId(userId: string, tenantId: string): Promise<Customer | null>;
  existsByEmail(email: string, tenantId: string): Promise<boolean>;
  list(tenantId: string, filters?: CustomerListFilters): Promise<CustomerListResult>;
  findForUpdate(id: CustomerId, tenantId: string): Promise<Customer | null>;
  countByStatus(tenantId: string): Promise<Record<string, number>>;
}
