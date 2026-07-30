import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { ReviewException, REVIEW_ERROR_CODES, ProductReview, ReviewResponse, ReviewVote, ProductReviewSummary, ReviewStatus } from '../domain';
import { REVIEW_REPOSITORY, REVIEW_RESPONSE_REPOSITORY, REVIEW_VOTE_REPOSITORY, REVIEW_SUMMARY_REPOSITORY } from '../domain';
import type { ReviewRepository, ReviewResponseRepository, ReviewVoteRepository, ReviewSummaryRepository } from '../domain';
import type { ProductReader, ProductVariantReader, CustomerReader, OrderReader, EventPublisher, Clock, CurrentActor, ContentSanitizer } from '../domain';
import { ReviewMapper } from '../application/mappers';
import type { ReviewListDto, ReviewResponseDto, ReviewSummaryDto } from '../application/dto';
import {
  CreateProductReviewCommand, GetPublicProductReviewsCommand, GetCustomerReviewsCommand, GetReviewByIdCommand, UpdateProductReviewCommand, DeleteProductReviewCommand,
  ListReviewsForModerationCommand, ApproveProductReviewCommand, RejectProductReviewCommand, HideProductReviewCommand, UnhideProductReviewCommand,
  ArchiveProductReviewCommand, RestoreProductReviewCommand, AddReviewResponseCommand, UpdateReviewResponseCommand, RemoveReviewResponseCommand,
  CastReviewVoteCommand, RemoveReviewVoteCommand, GetProductReviewSummaryCommand, RecalculateProductReviewSummaryCommand,
} from '../application/commands';
import { ReviewValidator } from '../application/validators';
import { REVIEW_ALLOWED_ORDER_STATUSES, REVIEW_CONTENT_MAX_LENGTH, REVIEW_CONTENT_MIN_LENGTH, REVIEW_TITLE_MAX_LENGTH } from '../constants';
import { ProductReviewCreatedEvent, ProductReviewUpdatedEvent, ProductReviewSubmittedEvent, ProductReviewApprovedEvent, ProductReviewRejectedEvent, ProductReviewHiddenEvent, ProductReviewArchivedEvent, ProductReviewDeletedEvent, ReviewResponseAddedEvent, ReviewVoteCastEvent, ProductReviewSummaryUpdatedEvent } from '../domain';

@Injectable()
export class ReviewAppService {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly reviewRepo: ReviewRepository,
    @Inject(REVIEW_RESPONSE_REPOSITORY) private readonly responseRepo: ReviewResponseRepository,
    @Inject(REVIEW_VOTE_REPOSITORY) private readonly voteRepo: ReviewVoteRepository,
    @Inject(REVIEW_SUMMARY_REPOSITORY) private readonly summaryRepo: ReviewSummaryRepository,
    @Inject('PRODUCT_READER') private readonly productReader: ProductReader,
    @Inject('PRODUCT_VARIANT_READER') private readonly variantReader: ProductVariantReader,
    @Inject('CUSTOMER_READER') private readonly customerReader: CustomerReader,
    @Inject('ORDER_READER') private readonly orderReader: OrderReader,
    @Inject('EVENT_PUBLISHER_REVIEWS') private readonly eventPublisher: EventPublisher,
    @Inject('CLOCK_REVIEWS') private readonly clock: Clock,
    @Inject('CURRENT_ACTOR_REVIEWS') private readonly actor: CurrentActor,
    @Inject('CONTENT_SANITIZER') private readonly sanitizer: ContentSanitizer,
    @Inject(LOGGER_TOKEN) private readonly logger: { info: (...args: unknown[]) => void; warn?: (...args: unknown[]) => void; error?: (...args: unknown[]) => void },
  ) {}

  private sanitize(value: string): string { return this.sanitizer.stripHtml(this.sanitizer.sanitize(value)).replace(/https?:\/\/\S+/gi, '').replace(/\s+/g, ' ').trim(); }
  private assertTenant(reviewTenantId: string, tenantId: string): void { if (reviewTenantId !== tenantId) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_TENANT_MISMATCH, 'Tenant mismatch'); }
  private async getReviewOrThrow(reviewId: string, tenantId: string): Promise<ProductReview> { const review = await this.reviewRepo.findById(reviewId, tenantId); if (!review) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_NOT_FOUND, 'Review not found'); return review; }
  private async recalc(productId: string, tenantId: string): Promise<ProductReviewSummary> { const list = await this.reviewRepo.listPublicByProduct(productId, tenantId, { limit: 1000, offset: 0 }); const summary = await this.summaryRepo.findByProduct(productId, tenantId) ?? ProductReviewSummary.empty(tenantId, productId); summary.recalculate(list.items.map(r => ({ rating: r.getRating(), isVerifiedPurchase: r.getIsVerifiedPurchase() }))); const saved = await this.summaryRepo.save(summary); await this.eventPublisher.publish(new ProductReviewSummaryUpdatedEvent(tenantId, productId)); return saved; }
  private displayName(review: ProductReview): string { return review.getIsVerifiedPurchase() ? 'Cliente verificado' : 'Usuario anónimo'; }
  private actorKey(command: { customerId?: string | null; guestFingerprintHash?: string | null }): string { return command.customerId ? `customer:${command.customerId}` : command.guestFingerprintHash ? `guest:${command.guestFingerprintHash}` : ''; }

  async createProductReview(command: CreateProductReviewCommand): Promise<ReviewResponseDto> {
    const errors = ReviewValidator.validateCreate(command); if (errors.length) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_CONTENT, errors.join('; '));
    const [product, variant, customerExists] = await Promise.all([this.productReader.getProduct(command.productId, command.tenantId), command.productVariantId ? this.variantReader.getVariant(command.productVariantId, command.tenantId) : Promise.resolve(null), this.customerReader.exists(command.customerId, command.tenantId)]);
    if (!product || product.deletedAt || product.status !== 'ACTIVE') throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_PRODUCT_NOT_FOUND, 'Product not found');
    if (!customerExists || !(await this.customerReader.isActive(command.customerId, command.tenantId))) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_CUSTOMER_MISMATCH, 'Customer mismatch');
    if (variant && variant.productId !== command.productId) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_VARIANT_MISMATCH, 'Variant mismatch');
    const verified = await this.orderReader.findVerifiedPurchase(command.customerId, command.productId, command.tenantId);
    if (!verified || !REVIEW_ALLOWED_ORDER_STATUSES.includes(verified.status as typeof REVIEW_ALLOWED_ORDER_STATUSES[number])) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_PURCHASE_NOT_VERIFIED, 'Purchase not verified');
    const exists = await this.reviewRepo.existsByCustomerAndProduct(command.customerId, command.productId, command.tenantId);
    if (exists) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_ALREADY_EXISTS, 'Review already exists');
    const review = ProductReview.create({ tenantId: command.tenantId, customerId: command.customerId, productId: command.productId, productVariantId: command.productVariantId ?? verified.productVariantId ?? null, orderId: verified.orderId, orderItemId: verified.orderItemId, rating: command.rating, title: command.title ?? null, content: this.sanitize(command.content), isVerifiedPurchase: true });
    await this.reviewRepo.save(review); await this.eventPublisher.publish(new ProductReviewCreatedEvent(command.tenantId, review.getId()));
    return ReviewMapper.toResponse(review, await this.voteRepo.countByReview(review.getId(), command.tenantId), await this.responseRepo.findByReview(review.getId(), command.tenantId), await this.customerReader.getDisplayName?.(command.customerId, command.tenantId) ?? this.displayName(review));
  }

  async getPublicProductReviews(command: GetPublicProductReviewsCommand): Promise<ReviewListDto> {
    const result = await this.reviewRepo.listPublicByProduct(command.productId, command.tenantId, { limit: command.limit ?? 20, offset: 0, rating: command.rating, verifiedOnly: command.verifiedOnly, sort: command.sort, cursor: command.cursor });
    const items = await Promise.all(result.items.map(async review => ReviewMapper.toResponse(review, await this.voteRepo.countByReview(review.getId(), command.tenantId), await this.responseRepo.findByReview(review.getId(), command.tenantId), await this.customerReader.getDisplayName?.(review.getCustomerId(), command.tenantId) ?? this.displayName(review))));
    return { items, total: result.total, limit: result.limit, offset: result.offset };
  }

  async getCustomerReviews(command: GetCustomerReviewsCommand): Promise<ReviewListDto> { const result = await this.reviewRepo.listByCustomer(command.customerId, command.tenantId, { limit: 50, offset: 0 }); return { items: await Promise.all(result.items.map(async review => ReviewMapper.toResponse(review, await this.voteRepo.countByReview(review.getId(), command.tenantId), await this.responseRepo.findByReview(review.getId(), command.tenantId), await this.customerReader.getDisplayName?.(review.getCustomerId(), command.tenantId) ?? this.displayName(review)))), total: result.total, limit: result.limit, offset: result.offset }; }
  async getReviewById(command: GetReviewByIdCommand): Promise<ReviewResponseDto> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); return ReviewMapper.toResponse(review, await this.voteRepo.countByReview(review.getId(), command.tenantId), await this.responseRepo.findByReview(review.getId(), command.tenantId), await this.customerReader.getDisplayName?.(review.getCustomerId(), command.tenantId) ?? this.displayName(review)); }

  async updateProductReview(command: UpdateProductReviewCommand): Promise<ReviewResponseDto> {
    const review = await this.getReviewOrThrow(command.reviewId, command.tenantId);
    if (review.getCustomerId() !== command.customerId) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_CUSTOMER_MISMATCH, 'Customer mismatch');
    const errors = ReviewValidator.validateUpdate(command); if (errors.length) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_INVALID_RATING, errors.join('; '));
    if (command.title !== undefined || command.content !== undefined) review.updateContent(command.title ?? review.getTitle(), this.sanitize(command.content ?? review.getContent()));
    if (command.rating !== undefined) review.updateRating(command.rating);
    if (review.getStatus().toString() === 'APPROVED') review.submitForModeration();
    await this.reviewRepo.save(review); await this.eventPublisher.publish(new ProductReviewUpdatedEvent(command.tenantId, review.getId()));
    return ReviewMapper.toResponse(review, await this.voteRepo.countByReview(review.getId(), command.tenantId), await this.responseRepo.findByReview(review.getId(), command.tenantId), await this.customerReader.getDisplayName?.(review.getCustomerId(), command.tenantId) ?? this.displayName(review));
  }

  async deleteProductReview(command: DeleteProductReviewCommand): Promise<void> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); if (review.getCustomerId() !== command.customerId) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_CUSTOMER_MISMATCH, 'Customer mismatch'); review.softDelete(this.clock.now()); await this.reviewRepo.save(review); await this.recalc(review.getProductId(), command.tenantId); await this.eventPublisher.publish(new ProductReviewDeletedEvent(command.tenantId, review.getId())); }
  async listReviewsForModeration(command: ListReviewsForModerationCommand): Promise<ReviewListDto> { const result = await this.reviewRepo.listForModeration(command.tenantId, { limit: 50, offset: 0 }); return { items: await Promise.all(result.items.map(async review => ReviewMapper.toResponse(review, await this.voteRepo.countByReview(review.getId(), command.tenantId), await this.responseRepo.findByReview(review.getId(), command.tenantId), await this.customerReader.getDisplayName?.(review.getCustomerId(), command.tenantId) ?? this.displayName(review)))), total: result.total, limit: result.limit, offset: result.offset }; }

  async approveProductReview(command: ApproveProductReviewCommand): Promise<ReviewResponseDto> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); review.approve(this.clock.now()); await this.reviewRepo.save(review); await this.recalc(review.getProductId(), command.tenantId); await this.eventPublisher.publish(new ProductReviewApprovedEvent(command.tenantId, review.getId())); return this.getReviewById(new GetReviewByIdCommand(command.tenantId, command.reviewId)); }
  async rejectProductReview(command: RejectProductReviewCommand): Promise<ReviewResponseDto> { const errors = ReviewValidator.validateRejection(command); if (errors.length) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_REJECTION_REASON_REQUIRED, errors.join('; ')); const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); review.reject(command.reason, this.clock.now()); await this.reviewRepo.save(review); await this.eventPublisher.publish(new ProductReviewRejectedEvent(command.tenantId, review.getId())); return this.getReviewById(new GetReviewByIdCommand(command.tenantId, command.reviewId)); }
  async hideProductReview(command: HideProductReviewCommand): Promise<ReviewResponseDto> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); review.hide(); await this.reviewRepo.save(review); await this.recalc(review.getProductId(), command.tenantId); await this.eventPublisher.publish(new ProductReviewHiddenEvent(command.tenantId, review.getId())); return this.getReviewById(new GetReviewByIdCommand(command.tenantId, command.reviewId)); }
  async unhideProductReview(command: UnhideProductReviewCommand): Promise<ReviewResponseDto> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); review.unhide(); await this.reviewRepo.save(review); await this.recalc(review.getProductId(), command.tenantId); return this.getReviewById(new GetReviewByIdCommand(command.tenantId, command.reviewId)); }
  async archiveProductReview(command: ArchiveProductReviewCommand): Promise<ReviewResponseDto> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); review.archive(); await this.reviewRepo.save(review); await this.recalc(review.getProductId(), command.tenantId); await this.eventPublisher.publish(new ProductReviewArchivedEvent(command.tenantId, review.getId())); return this.getReviewById(new GetReviewByIdCommand(command.tenantId, command.reviewId)); }
  async restoreProductReview(command: RestoreProductReviewCommand): Promise<ReviewResponseDto> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); review.restore(); await this.reviewRepo.save(review); await this.recalc(review.getProductId(), command.tenantId); return this.getReviewById(new GetReviewByIdCommand(command.tenantId, command.reviewId)); }

  async addReviewResponse(command: AddReviewResponseCommand): Promise<ReviewResponseDto> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); const existing = await this.responseRepo.findByReview(command.reviewId, command.tenantId); if (existing && !existing.toPrimitives().deletedAt) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_RESPONSE_ALREADY_EXISTS, 'Response already exists'); const response = ReviewResponse.create(command.tenantId, command.reviewId, this.sanitize(command.content), command.createdBy); await this.responseRepo.save(response); await this.eventPublisher.publish(new ReviewResponseAddedEvent(command.tenantId, review.getId())); return this.getReviewById(new GetReviewByIdCommand(command.tenantId, command.reviewId)); }
  async updateReviewResponse(command: UpdateReviewResponseCommand): Promise<ReviewResponseDto> { const response = await this.responseRepo.findByReview(command.reviewId, command.tenantId); if (!response) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_RESPONSE_NOT_FOUND, 'Response not found'); response.update(this.sanitize(command.content)); await this.responseRepo.save(response); return this.getReviewById(new GetReviewByIdCommand(command.tenantId, command.reviewId)); }
  async removeReviewResponse(command: RemoveReviewResponseCommand): Promise<void> { const response = await this.responseRepo.findByReview(command.reviewId, command.tenantId); if (!response) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_RESPONSE_NOT_FOUND, 'Response not found'); await this.responseRepo.softDelete(response.getId(), command.tenantId); }

  async castReviewVote(command: CastReviewVoteCommand): Promise<{ helpfulCount: number; notHelpfulCount: number }> { const review = await this.getReviewOrThrow(command.reviewId, command.tenantId); const actorKey = this.actorKey(command); if (!actorKey) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_VOTE_ALREADY_EXISTS, 'Actor required'); if (review.getCustomerId() === command.customerId && command.customerId) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_SELF_VOTE_FORBIDDEN, 'Self vote forbidden'); const existing = await this.voteRepo.findByActorAndReview(command.reviewId, actorKey, command.tenantId); const vote = existing ? (existing.changeVote(command.vote), existing) : ReviewVote.create({ tenantId: command.tenantId, reviewId: command.reviewId, customerId: command.customerId ?? null, guestFingerprintHash: command.guestFingerprintHash ?? null, vote: command.vote }); await this.voteRepo.save(vote); await this.eventPublisher.publish(new ReviewVoteCastEvent(command.tenantId, review.getId())); const counts = await this.voteRepo.countByReview(command.reviewId, command.tenantId); return { helpfulCount: counts.helpful, notHelpfulCount: counts.notHelpful }; }
  async removeReviewVote(command: RemoveReviewVoteCommand): Promise<void> { const actorKey = this.actorKey(command); if (!actorKey) return; const vote = await this.voteRepo.findByActorAndReview(command.reviewId, actorKey, command.tenantId); if (vote) await this.voteRepo.delete(vote.getId(), command.tenantId); }

  async getProductReviewSummary(command: GetProductReviewSummaryCommand): Promise<ReviewSummaryDto> { const summary = await this.summaryRepo.findByProduct(command.productId, command.tenantId) ?? ProductReviewSummary.empty(command.tenantId, command.productId); return ReviewMapper.toSummary(summary); }
  async recalculateProductReviewSummary(command: RecalculateProductReviewSummaryCommand): Promise<ReviewSummaryDto> { return ReviewMapper.toSummary(await this.recalc(command.productId, command.tenantId)); }
}
