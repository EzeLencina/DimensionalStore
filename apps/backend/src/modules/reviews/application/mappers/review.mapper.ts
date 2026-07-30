import type { ProductReview, ProductReviewSummary, ReviewResponse } from '../../domain';
import type { ReviewResponseDto, ReviewSummaryDto } from '../dto';

export class ReviewMapper {
  static toResponse(review: ProductReview, counts: { helpful: number; notHelpful: number } = { helpful: 0, notHelpful: 0 }, response: ReviewResponse | null = null, customerDisplayName = 'Usuario anónimo'): ReviewResponseDto {
    const p = review.toPrimitives();
    return { id: p.id, tenantId: p.tenantId, productId: p.productId, productVariantId: p.productVariantId, rating: p.rating, title: p.title, content: p.content, status: p.status, isVerifiedPurchase: p.isVerifiedPurchase, publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null, helpfulCount: counts.helpful, notHelpfulCount: counts.notHelpful, administrativeResponse: response ? { id: response.getId(), content: response.toPrimitives().content, createdAt: response.toPrimitives().createdAt.toISOString() } : null, customerDisplayName };
  }
  static toSummary(summary: ProductReviewSummary): ReviewSummaryDto { const p = summary.toPrimitives(); return { tenantId: p.tenantId, productId: p.productId, averageRating: Number(p.averageRating), totalReviews: p.totalReviews, rating1Count: p.rating1Count, rating2Count: p.rating2Count, rating3Count: p.rating3Count, rating4Count: p.rating4Count, rating5Count: p.rating5Count, verifiedReviewsCount: p.verifiedReviewsCount, updatedAt: p.updatedAt.toISOString(), version: p.version }; }
}
