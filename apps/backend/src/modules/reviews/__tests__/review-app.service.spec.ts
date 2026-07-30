import { ReviewAppService } from '../services';
import { InMemoryReviewRepository, InMemoryReviewResponseRepository, InMemoryReviewVoteRepository, InMemoryReviewSummaryRepository } from '../infrastructure';
import { CreateProductReviewCommand, UpdateProductReviewCommand, ApproveProductReviewCommand, CastReviewVoteCommand, GetProductReviewSummaryCommand } from '../application/commands';

describe('ReviewAppService', () => {
  let service: ReviewAppService;

  beforeEach(() => {
    const reviewRepo = new InMemoryReviewRepository();
    const responseRepo = new InMemoryReviewResponseRepository();
    const voteRepo = new InMemoryReviewVoteRepository();
    const summaryRepo = new InMemoryReviewSummaryRepository();
    const productReader = { getProduct: async () => ({ id: 'product-1', tenantId: 'tenant-1', name: 'Producto', slug: 'producto', status: 'ACTIVE', visibility: 'PUBLIC', deletedAt: null }) };
    const variantReader = { getVariant: async () => null };
    const customerReader = { exists: async () => true, isActive: async () => true, getDisplayName: async () => 'Juan P.' };
    const orderReader = { findVerifiedPurchase: async () => ({ orderId: 'order-1', orderItemId: 'order-item-1', productVariantId: null, status: 'DELIVERED' }), isOrderAllowedForReview: async () => true };
    const eventPublisher = { publish: async () => {} };
    const clock = { now: () => new Date('2026-01-01') };
    const actor = { getType: () => 'ADMIN', getId: () => 'admin-1' };
    const sanitizer = { sanitize: (input: string) => input, stripHtml: (input: string) => input.replace(/<[^>]*>/g, '') };
    const logger = { info: () => {}, warn: () => {}, error: () => {} };

    service = new ReviewAppService(reviewRepo as never, responseRepo as never, voteRepo as never, summaryRepo as never, productReader as never, variantReader as never, customerReader as never, orderReader as never, eventPublisher as never, clock as never, actor as never, sanitizer as never, logger as never);
  });

  it('creates, approves, summarizes and votes', async () => {
    const created = await service.createProductReview(new CreateProductReviewCommand('tenant-1', 'customer-1', 'product-1', 5, '<p>Excelente producto!</p>', 'Muy bueno'));
    expect(created.status).toBe('PENDING');

    const approved = await service.approveProductReview(new ApproveProductReviewCommand('tenant-1', created.id));
    expect(approved.status).toBe('APPROVED');

    const updated = await service.updateProductReview(new UpdateProductReviewCommand('tenant-1', 'customer-1', created.id, 4, 'Mejor', 'Texto mejorado'));
    expect(updated.status).toBe('PENDING');

    const vote = await service.castReviewVote(new CastReviewVoteCommand('tenant-1', created.id, 'HELPFUL', 'customer-2', null));
    expect(vote.helpfulCount).toBe(1);

    const summary = await service.getProductReviewSummary(new GetProductReviewSummaryCommand('tenant-1', 'product-1'));
    expect(summary.productId).toBe('product-1');
  });
});
