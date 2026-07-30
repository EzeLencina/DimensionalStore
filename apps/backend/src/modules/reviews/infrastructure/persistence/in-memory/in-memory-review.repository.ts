import type { ProductReview } from '../../../domain';
import type { ReviewRepository, ReviewListFilters, ReviewListResult } from '../../../domain';

export class InMemoryReviewRepository implements ReviewRepository {
  private store = new Map<string, ProductReview>();
  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }
  async save(review: ProductReview): Promise<ProductReview> { this.store.set(this.key(review.getId(), review.getTenantId()), review); return review; }
  async findById(id: string, tenantId: string): Promise<ProductReview | null> { return this.store.get(this.key(id, tenantId)) ?? null; }
  async findByCustomerAndProduct(customerId: string, productId: string, tenantId: string): Promise<ProductReview | null> { return Array.from(this.store.values()).find(r => r.getTenantId() === tenantId && r.getCustomerId() === customerId && r.getProductId() === productId && !r.isDeleted()) ?? null; }
  async existsByCustomerAndProduct(customerId: string, productId: string, tenantId: string): Promise<boolean> { return (await this.findByCustomerAndProduct(customerId, productId, tenantId)) !== null; }
  async listPublicByProduct(productId: string, tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult> { const items = Array.from(this.store.values()).filter(r => r.getTenantId() === tenantId && r.getProductId() === productId && r.getStatus().toString() === 'APPROVED' && !r.isDeleted()); const total = items.length; const limit = filters?.limit ?? 20; const offset = filters?.offset ?? 0; return { items: items.slice(offset, offset + limit), total, limit, offset }; }
  async listForModeration(tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult> { const items = Array.from(this.store.values()).filter(r => r.getTenantId() === tenantId && !r.isDeleted()); const total = items.length; const limit = filters?.limit ?? 20; const offset = filters?.offset ?? 0; return { items: items.slice(offset, offset + limit), total, limit, offset }; }
  async listByCustomer(customerId: string, tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult> { const items = Array.from(this.store.values()).filter(r => r.getTenantId() === tenantId && r.getCustomerId() === customerId && !r.isDeleted()); const total = items.length; const limit = filters?.limit ?? 20; const offset = filters?.offset ?? 0; return { items: items.slice(offset, offset + limit), total, limit, offset }; }
  async findForUpdate(id: string, tenantId: string): Promise<ProductReview | null> { return this.findById(id, tenantId); }
  async countByStatus(tenantId: string, status: string): Promise<number> { return Array.from(this.store.values()).filter(r => r.getTenantId() === tenantId && r.getStatus().toString() === status).length; }
}
