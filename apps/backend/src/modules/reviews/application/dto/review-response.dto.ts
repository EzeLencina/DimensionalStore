export type ReviewResponseDto = {
  id: string; tenantId: string; productId: string; productVariantId: string | null; rating: number; title: string | null; content: string; status: string; isVerifiedPurchase: boolean; publishedAt: string | null; helpfulCount: number; notHelpfulCount: number; administrativeResponse: { id: string; content: string; createdAt: string } | null; customerDisplayName: string;
};

export type ReviewSummaryDto = { tenantId: string; productId: string; averageRating: number; totalReviews: number; rating1Count: number; rating2Count: number; rating3Count: number; rating4Count: number; rating5Count: number; verifiedReviewsCount: number; updatedAt: string; version: number };
export type ReviewListDto = { items: ReviewResponseDto[]; total: number; limit: number; offset: number };
