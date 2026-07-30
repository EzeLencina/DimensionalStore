import { CustomerId, ModerationReason, OrderId, OrderItemId, ProductId, ProductVariantId, Rating, ReviewContent, ReviewId, ReviewStatus, ReviewTitle, TenantId } from '../value-objects/review.value-objects';
import { ReviewException, REVIEW_ERROR_CODES } from '../exceptions/review.exception';

export type ProductReviewPrimitives = {
  id: string; tenantId: string; productId: string; productVariantId: string | null; customerId: string; orderId: string | null; orderItemId: string | null; rating: number; title: string | null; content: string; status: string; isVerifiedPurchase: boolean; publishedAt: Date | null; rejectedAt: Date | null; rejectionReason: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null; version: number;
};

export class ProductReview {
  private constructor(
    private id: ReviewId,
    private tenantId: TenantId,
    private productId: ProductId,
    private productVariantId: ProductVariantId | null,
    private customerId: CustomerId,
    private orderId: OrderId | null,
    private orderItemId: OrderItemId | null,
    private rating: Rating,
    private title: ReviewTitle,
    private content: ReviewContent,
    private status: ReviewStatus,
    private isVerifiedPurchase: boolean,
    private publishedAt: Date | null,
    private rejectedAt: Date | null,
    private rejectionReason: string | null,
    private createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null,
    private version: number,
  ) {}

  static create(params: { tenantId: string; productId: string; customerId: string; orderId?: string | null; orderItemId?: string | null; productVariantId?: string | null; rating: number; title?: string | null; content: string; isVerifiedPurchase: boolean; createdAt?: Date; }): ProductReview {
    return new ProductReview(
      new ReviewId(), new TenantId(params.tenantId), new ProductId(params.productId), params.productVariantId ? new ProductVariantId(params.productVariantId) : null, new CustomerId(params.customerId), params.orderId ? new OrderId(params.orderId) : null, params.orderItemId ? new OrderItemId(params.orderItemId) : null, new Rating(params.rating), new ReviewTitle(params.title ?? null), new ReviewContent(params.content), ReviewStatus.PENDING(), params.isVerifiedPurchase, null, null, null, params.createdAt ?? new Date(), params.createdAt ?? new Date(), null, 1,
    );
  }

  static fromPrimitives(p: ProductReviewPrimitives): ProductReview {
    return new ProductReview(new ReviewId(p.id), new TenantId(p.tenantId), new ProductId(p.productId), p.productVariantId ? new ProductVariantId(p.productVariantId) : null, new CustomerId(p.customerId), p.orderId ? new OrderId(p.orderId) : null, p.orderItemId ? new OrderItemId(p.orderItemId) : null, new Rating(p.rating), new ReviewTitle(p.title), new ReviewContent(p.content), ReviewStatus.from(p.status), p.isVerifiedPurchase, p.publishedAt, p.rejectedAt, p.rejectionReason, p.createdAt, p.updatedAt, p.deletedAt, p.version);
  }

  toPrimitives(): ProductReviewPrimitives { return { id: this.id.toString(), tenantId: this.tenantId.toString(), productId: this.productId.toString(), productVariantId: this.productVariantId?.toString() ?? null, customerId: this.customerId.toString(), orderId: this.orderId?.toString() ?? null, orderItemId: this.orderItemId?.toString() ?? null, rating: this.rating.toNumber(), title: this.title.toString(), content: this.content.toString(), status: this.status.toString(), isVerifiedPurchase: this.isVerifiedPurchase, publishedAt: this.publishedAt, rejectedAt: this.rejectedAt, rejectionReason: this.rejectionReason, createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt, version: this.version }; }

  getId(): string { return this.id.toString(); }
  getTenantId(): string { return this.tenantId.toString(); }
  getProductId(): string { return this.productId.toString(); }
  getProductVariantId(): string | null { return this.productVariantId?.toString() ?? null; }
  getCustomerId(): string { return this.customerId.toString(); }
  getOrderId(): string | null { return this.orderId?.toString() ?? null; }
  getOrderItemId(): string | null { return this.orderItemId?.toString() ?? null; }
  getRating(): number { return this.rating.toNumber(); }
  getTitle(): string | null { return this.title.toString(); }
  getContent(): string { return this.content.toString(); }
  getStatus(): ReviewStatus { return this.status; }
  getIsVerifiedPurchase(): boolean { return this.isVerifiedPurchase; }
  getPublishedAt(): Date | null { return this.publishedAt; }
  getRejectedAt(): Date | null { return this.rejectedAt; }
  getRejectionReason(): string | null { return this.rejectionReason; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }
  isDeleted(): boolean { return this.deletedAt !== null; }

  updateContent(title: string | null, content: string): void { this.assertEditable(); this.title = new ReviewTitle(title); this.content = new ReviewContent(content); this.touch(); if (this.status.toString() === 'APPROVED') this.submitForModeration(); }
  updateRating(rating: number): void { this.assertEditable(); this.rating = new Rating(rating); this.touch(); if (this.status.toString() === 'APPROVED') this.submitForModeration(); }
  submitForModeration(): void { if (!this.status.canTransitionTo('PENDING') && this.status.toString() !== 'PENDING') throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_STATUS_TRANSITION, 'Invalid transition'); this.status = ReviewStatus.PENDING(); this.rejectedAt = null; this.rejectionReason = null; this.touch(); }
  approve(now: Date): void { if (this.status.toString() === 'APPROVED') throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_ALREADY_APPROVED, 'Already approved'); if (!this.status.canTransitionTo('APPROVED')) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_STATUS_TRANSITION, 'Invalid transition'); this.status = ReviewStatus.APPROVED(); this.publishedAt = now; this.rejectedAt = null; this.rejectionReason = null; this.touch(); }
  reject(reason: string, now: Date): void { if (!reason?.trim()) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_REJECTION_REASON_REQUIRED, 'Rejection reason required'); if (!this.status.canTransitionTo('REJECTED')) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_STATUS_TRANSITION, 'Invalid transition'); this.status = ReviewStatus.REJECTED(); this.rejectedAt = now; this.rejectionReason = new ModerationReason(reason).toString(); this.publishedAt = null; this.touch(); }
  hide(): void { if (!this.status.canTransitionTo('HIDDEN')) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_STATUS_TRANSITION, 'Invalid transition'); this.status = ReviewStatus.HIDDEN(); this.touch(); }
  unhide(): void { if (!this.status.canTransitionTo('APPROVED')) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_STATUS_TRANSITION, 'Invalid transition'); this.status = ReviewStatus.APPROVED(); this.touch(); }
  archive(): void { if (!this.status.canTransitionTo('ARCHIVED')) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_STATUS_TRANSITION, 'Invalid transition'); this.status = ReviewStatus.ARCHIVED(); this.touch(); }
  restore(): void { if (!this.status.canTransitionTo('PENDING')) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_STATUS_TRANSITION, 'Invalid transition'); this.status = ReviewStatus.PENDING(); this.deletedAt = null; this.touch(); }
  softDelete(now: Date): void { this.deletedAt = now; this.touch(); }

  private assertEditable(): void { if (this.status.toString() === 'ARCHIVED' || this.deletedAt) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_NOT_EDITABLE, 'Review not editable'); }
  private touch(): void { this.updatedAt = new Date(); this.version++; }
}
