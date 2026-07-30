import { ProductReview, ProductReviewSummary, ReviewResponse, ReviewVote } from '../../../domain';

type ProductReviewRecord = { id: string; tenantId: string; productId: string; productVariantId: string | null; customerId: string; orderId: string | null; orderItemId: string | null; rating: number; title: string | null; content: string; status: string; isVerifiedPurchase: boolean; publishedAt: Date | null; rejectedAt: Date | null; rejectionReason: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null; version: number };
type ReviewResponseRecord = { id: string; tenantId: string; reviewId: string; content: string; createdBy: string; createdAt: Date; updatedAt: Date | null; deletedAt: Date | null };
type ReviewVoteRecord = { id: string; tenantId: string; reviewId: string; customerId: string | null; guestFingerprintHash: string | null; actorKey: string; vote: 'HELPFUL' | 'NOT_HELPFUL'; createdAt: Date; updatedAt: Date };
type ReviewSummaryRecord = { tenantId: string; productId: string; averageRating: unknown; totalReviews: number; rating1Count: number; rating2Count: number; rating3Count: number; rating4Count: number; rating5Count: number; verifiedReviewsCount: number; updatedAt: Date; version: number };

export class ReviewPrismaMapper {
  static reviewToDomain(raw: ProductReviewRecord): ProductReview { return ProductReview.fromPrimitives(raw); }
  static reviewToPrisma(review: ProductReview): ProductReviewRecord { return review.toPrimitives(); }
  static responseToDomain(raw: ReviewResponseRecord): ReviewResponse { return ReviewResponse.fromPrimitives(raw); }
  static responseToPrisma(response: ReviewResponse): ReviewResponseRecord { return response.toPrimitives(); }
  static voteToDomain(raw: ReviewVoteRecord): ReviewVote { return ReviewVote.fromPrimitives(raw); }
  static voteToPrisma(vote: ReviewVote): ReviewVoteRecord { return vote.toPrimitives(); }
  static summaryToDomain(raw: ReviewSummaryRecord): ProductReviewSummary { return ProductReviewSummary.fromPrimitives({ ...raw, averageRating: String(raw.averageRating) }); }
  static summaryToPrisma(summary: ProductReviewSummary): ReviewSummaryRecord { const p = summary.toPrimitives(); return { ...p, averageRating: p.averageRating }; }
}
