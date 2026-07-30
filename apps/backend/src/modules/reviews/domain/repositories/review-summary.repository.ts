import type { ProductReviewSummary } from '../aggregates/product-review-summary.aggregate';

export interface ReviewSummaryRepository {
  save(summary: ProductReviewSummary): Promise<ProductReviewSummary>;
  findByProduct(productId: string, tenantId: string): Promise<ProductReviewSummary | null>;
  recalculate(productId: string, tenantId: string): Promise<ProductReviewSummary>;
}

export const REVIEW_SUMMARY_REPOSITORY = 'REVIEW_SUMMARY_REPOSITORY';
