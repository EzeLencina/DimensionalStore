import { ReviewException, REVIEW_ERROR_CODES } from '../exceptions/review.exception';
import { ReviewResponseId } from '../value-objects/review.value-objects';

export type ReviewResponsePrimitives = { id: string; tenantId: string; reviewId: string; content: string; createdBy: string; createdAt: Date; updatedAt: Date | null; deletedAt: Date | null };

export class ReviewResponse {
  private constructor(private id: ReviewResponseId, private tenantId: string, private reviewId: string, private content: string, private createdBy: string, private createdAt: Date, private updatedAt: Date | null, private deletedAt: Date | null) {}
  static create(tenantId: string, reviewId: string, content: string, createdBy: string): ReviewResponse { if (!content?.trim()) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_CONTENT, 'Invalid response'); return new ReviewResponse(new ReviewResponseId(), tenantId, reviewId, content.trim(), createdBy, new Date(), null, null); }
  static fromPrimitives(p: ReviewResponsePrimitives): ReviewResponse { return new ReviewResponse(new ReviewResponseId(p.id), p.tenantId, p.reviewId, p.content, p.createdBy, p.createdAt, p.updatedAt, p.deletedAt); }
  toPrimitives(): ReviewResponsePrimitives { return { id: this.id.toString(), tenantId: this.tenantId, reviewId: this.reviewId, content: this.content, createdBy: this.createdBy, createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt }; }
  getId(): string { return this.id.toString(); }
  getReviewId(): string { return this.reviewId; }
  getTenantId(): string { return this.tenantId; }
  update(content: string): void { if (!content?.trim()) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_CONTENT, 'Invalid response'); this.content = content.trim(); this.updatedAt = new Date(); }
  softDelete(now: Date): void { this.deletedAt = now; this.updatedAt = now; }
}
