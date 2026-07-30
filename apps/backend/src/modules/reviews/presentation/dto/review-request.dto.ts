export type CreateProductReviewRequestDto = { productId: string; productVariantId?: string | null; rating: number; title?: string | null; content: string };
export type UpdateProductReviewRequestDto = { rating?: number; title?: string | null; content?: string };
export type ReviewResponseRequestDto = { content: string };
export type ReviewVoteRequestDto = { vote: 'HELPFUL' | 'NOT_HELPFUL'; customerId?: string | null; guestFingerprintHash?: string | null };
