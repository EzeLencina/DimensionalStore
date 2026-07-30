import type { ReviewResponse } from '../aggregates/review-response.aggregate';

export interface ReviewResponseRepository {
  save(response: ReviewResponse): Promise<ReviewResponse>;
  findByReview(reviewId: string, tenantId: string): Promise<ReviewResponse | null>;
  softDelete(id: string, tenantId: string): Promise<void>;
}

export const REVIEW_RESPONSE_REPOSITORY = 'REVIEW_RESPONSE_REPOSITORY';
