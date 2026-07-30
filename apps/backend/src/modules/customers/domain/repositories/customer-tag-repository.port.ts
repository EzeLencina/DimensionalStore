import type { CustomerTag } from '../aggregates';

export const CUSTOMER_TAG_REPOSITORY = 'CUSTOMER_TAG_REPOSITORY';

export interface CustomerTagRepository {
  save(tag: CustomerTag): Promise<CustomerTag>;
  findById(id: string, tenantId: string): Promise<CustomerTag | null>;
  findBySlug(slug: string, tenantId: string): Promise<CustomerTag | null>;
  list(tenantId: string): Promise<CustomerTag[]>;
  existsBySlug(slug: string, tenantId: string): Promise<boolean>;
}
