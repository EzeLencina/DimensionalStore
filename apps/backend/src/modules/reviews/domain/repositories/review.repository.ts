import type { ProductReview } from '../aggregates/product-review.aggregate';

export type ReviewListFilters = { limit?: number; offset?: number; rating?: number; verifiedOnly?: boolean; status?: string; sort?: string; cursor?: string };
export type ReviewListResult = { items: ProductReview[]; total: number; limit: number; offset: number };

export interface ReviewRepository {
  save(review: ProductReview): Promise<ProductReview>;
  findById(id: string, tenantId: string): Promise<ProductReview | null>;
  findByCustomerAndProduct(customerId: string, productId: string, tenantId: string): Promise<ProductReview | null>;
  existsByCustomerAndProduct(customerId: string, productId: string, tenantId: string): Promise<boolean>;
  listPublicByProduct(productId: string, tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult>;
  listForModeration(tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult>;
  listByCustomer(customerId: string, tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult>;
  findForUpdate(id: string, tenantId: string): Promise<ProductReview | null>;
  countByStatus(tenantId: string, status: string): Promise<number>;
}

export const REVIEW_REPOSITORY = 'REVIEW_REPOSITORY';
