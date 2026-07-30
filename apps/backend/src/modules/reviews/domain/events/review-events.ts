abstract class BaseReviewEvent {
  constructor(public readonly type: string, public readonly tenantId: string, public readonly reviewId: string, public readonly occurredAt: Date = new Date()) {}
}
export class ProductReviewCreatedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.product_review.created', tenantId, reviewId); } }
export class ProductReviewUpdatedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.product_review.updated', tenantId, reviewId); } }
export class ProductReviewSubmittedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.product_review.submitted', tenantId, reviewId); } }
export class ProductReviewApprovedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.product_review.approved', tenantId, reviewId); } }
export class ProductReviewRejectedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.product_review.rejected', tenantId, reviewId); } }
export class ProductReviewHiddenEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.product_review.hidden', tenantId, reviewId); } }
export class ProductReviewArchivedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.product_review.archived', tenantId, reviewId); } }
export class ProductReviewDeletedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.product_review.deleted', tenantId, reviewId); } }
export class ReviewResponseAddedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.response.added', tenantId, reviewId); } }
export class ReviewVoteCastEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.vote.cast', tenantId, reviewId); } }
export class ProductReviewSummaryUpdatedEvent extends BaseReviewEvent { constructor(tenantId: string, reviewId: string) { super('reviews.summary.updated', tenantId, reviewId); } }
