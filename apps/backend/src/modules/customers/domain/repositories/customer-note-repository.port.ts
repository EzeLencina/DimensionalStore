import type { CustomerNote } from '../aggregates';

export const CUSTOMER_NOTE_REPOSITORY = 'CUSTOMER_NOTE_REPOSITORY';

export interface CustomerNoteRepository {
  save(note: CustomerNote): Promise<CustomerNote>;
  findById(id: string, tenantId: string): Promise<CustomerNote | null>;
  listByCustomer(customerId: string, tenantId: string): Promise<CustomerNote[]>;
  softDelete(id: string, tenantId: string): Promise<void>;
}
