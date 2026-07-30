export class CreateProductReviewCommand { constructor(public readonly tenantId: string, public readonly customerId: string, public readonly productId: string, public readonly rating: number, public readonly content: string, public readonly title?: string | null, public readonly productVariantId?: string | null, public readonly orderId?: string | null, public readonly orderItemId?: string | null) {} }
export class GetPublicProductReviewsCommand { constructor(public readonly tenantId: string, public readonly productId: string, public readonly rating?: number, public readonly verifiedOnly?: boolean, public readonly sort?: string, public readonly cursor?: string, public readonly limit?: number) {} }
export class GetCustomerReviewsCommand { constructor(public readonly tenantId: string, public readonly customerId: string) {} }
export class GetReviewByIdCommand { constructor(public readonly tenantId: string, public readonly reviewId: string) {} }
export class UpdateProductReviewCommand { constructor(public readonly tenantId: string, public readonly customerId: string, public readonly reviewId: string, public readonly rating?: number, public readonly title?: string | null, public readonly content?: string) {} }
export class DeleteProductReviewCommand { constructor(public readonly tenantId: string, public readonly customerId: string, public readonly reviewId: string) {} }
export class ListReviewsForModerationCommand { constructor(public readonly tenantId: string) {} }
export class ApproveProductReviewCommand { constructor(public readonly tenantId: string, public readonly reviewId: string) {} }
export class RejectProductReviewCommand { constructor(public readonly tenantId: string, public readonly reviewId: string, public readonly reason: string) {} }
export class HideProductReviewCommand { constructor(public readonly tenantId: string, public readonly reviewId: string, public readonly reason: string) {} }
export class UnhideProductReviewCommand { constructor(public readonly tenantId: string, public readonly reviewId: string) {} }
export class ArchiveProductReviewCommand { constructor(public readonly tenantId: string, public readonly reviewId: string) {} }
export class RestoreProductReviewCommand { constructor(public readonly tenantId: string, public readonly reviewId: string) {} }
export class AddReviewResponseCommand { constructor(public readonly tenantId: string, public readonly reviewId: string, public readonly content: string, public readonly createdBy: string) {} }
export class UpdateReviewResponseCommand { constructor(public readonly tenantId: string, public readonly reviewId: string, public readonly content: string) {} }
export class RemoveReviewResponseCommand { constructor(public readonly tenantId: string, public readonly reviewId: string) {} }
export class CastReviewVoteCommand { constructor(public readonly tenantId: string, public readonly reviewId: string, public readonly vote: 'HELPFUL' | 'NOT_HELPFUL', public readonly customerId?: string | null, public readonly guestFingerprintHash?: string | null) {} }
export class RemoveReviewVoteCommand { constructor(public readonly tenantId: string, public readonly reviewId: string, public readonly customerId?: string | null, public readonly guestFingerprintHash?: string | null) {} }
export class GetProductReviewSummaryCommand { constructor(public readonly tenantId: string, public readonly productId: string) {} }
export class RecalculateProductReviewSummaryCommand { constructor(public readonly tenantId: string, public readonly productId: string) {} }
