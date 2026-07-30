import { ProductReview } from '..';

describe('ProductReview', () => {
  it('creates pending and approves', () => {
    const review = ProductReview.create({ tenantId: 'tenant-1', customerId: 'customer-1', productId: 'product-1', rating: 5, content: 'Excelente producto', isVerifiedPurchase: true });
    expect(review.getStatus().toString()).toBe('PENDING');
    review.approve(new Date('2026-01-01'));
    expect(review.getStatus().toString()).toBe('APPROVED');
  });

  it('rejects and returns to moderation on edits', () => {
    const review = ProductReview.create({ tenantId: 'tenant-1', customerId: 'customer-1', productId: 'product-1', rating: 4, content: 'Buen producto', isVerifiedPurchase: true });
    review.approve(new Date('2026-01-01'));
    review.updateContent('Nuevo título', 'Contenido actualizado');
    expect(review.getStatus().toString()).toBe('PENDING');
  });
});
