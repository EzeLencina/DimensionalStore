import type { ReviewResponse } from '../../../domain';
import type { ReviewResponseRepository } from '../../../domain';

export class InMemoryReviewResponseRepository implements ReviewResponseRepository {
  private store = new Map<string, ReviewResponse>();
  private key(reviewId: string, tenantId: string): string { return `${tenantId}:${reviewId}`; }
  async save(response: ReviewResponse): Promise<ReviewResponse> { this.store.set(this.key(response.getReviewId(), response.getTenantId()), response); return response; }
  async findByReview(reviewId: string, tenantId: string): Promise<ReviewResponse | null> { return this.store.get(this.key(reviewId, tenantId)) ?? null; }
  async softDelete(id: string, tenantId: string): Promise<void> { const response = Array.from(this.store.values()).find(r => r.getTenantId() === tenantId && r.getId() === id); if (response) response.softDelete(new Date()); }
}
