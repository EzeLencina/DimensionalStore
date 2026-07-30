import { ProductReviewSummary } from '../../../domain';
import type { ReviewSummaryRepository } from '../../../domain';

export class InMemoryReviewSummaryRepository implements ReviewSummaryRepository {
  private store = new Map<string, ProductReviewSummary>();
  private key(productId: string, tenantId: string): string { return `${tenantId}:${productId}`; }
  async save(summary: ProductReviewSummary): Promise<ProductReviewSummary> { this.store.set(this.key(summary.getProductId(), summary.getTenantId()), summary); return summary; }
  async findByProduct(productId: string, tenantId: string): Promise<ProductReviewSummary | null> { return this.store.get(this.key(productId, tenantId)) ?? null; }
  async recalculate(productId: string, tenantId: string): Promise<ProductReviewSummary> { const current = this.store.get(this.key(productId, tenantId)) ?? ProductReviewSummary.empty(tenantId, productId); return current; }
}
