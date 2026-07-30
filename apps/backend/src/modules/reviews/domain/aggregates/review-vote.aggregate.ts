import { GuestFingerprintHash, ReviewVoteId } from '../value-objects/review.value-objects';
import type { ReviewVoteValue } from '../value-objects/review.value-objects';
import { ReviewException, REVIEW_ERROR_CODES } from '../exceptions/review.exception';

export type ReviewVotePrimitives = { id: string; tenantId: string; reviewId: string; customerId: string | null; guestFingerprintHash: string | null; actorKey: string; vote: ReviewVoteValue; createdAt: Date; updatedAt: Date };

export class ReviewVote {
  private constructor(private id: ReviewVoteId, private tenantId: string, private reviewId: string, private customerId: string | null, private guestFingerprintHash: GuestFingerprintHash | null, private actorKey: string, private vote: ReviewVoteValue, private createdAt: Date, private updatedAt: Date) {}
  static create(params: { tenantId: string; reviewId: string; customerId?: string | null; guestFingerprintHash?: string | null; vote: ReviewVoteValue }): ReviewVote { const actorKey = params.customerId ? `customer:${params.customerId}` : params.guestFingerprintHash ? `guest:${params.guestFingerprintHash}` : ''; if (!actorKey) throw new ReviewException(REVIEW_ERROR_CODES.REVIEW_VOTE_ALREADY_EXISTS, 'Actor key required'); return new ReviewVote(new ReviewVoteId(), params.tenantId, params.reviewId, params.customerId ?? null, params.guestFingerprintHash ? new GuestFingerprintHash(params.guestFingerprintHash) : null, actorKey, params.vote, new Date(), new Date()); }
  static fromPrimitives(p: ReviewVotePrimitives): ReviewVote { return new ReviewVote(new ReviewVoteId(p.id), p.tenantId, p.reviewId, p.customerId, p.guestFingerprintHash ? new GuestFingerprintHash(p.guestFingerprintHash) : null, p.actorKey, p.vote, p.createdAt, p.updatedAt); }
  toPrimitives(): ReviewVotePrimitives { return { id: this.id.toString(), tenantId: this.tenantId, reviewId: this.reviewId, customerId: this.customerId, guestFingerprintHash: this.guestFingerprintHash?.toString() ?? null, actorKey: this.actorKey, vote: this.vote, createdAt: this.createdAt, updatedAt: this.updatedAt }; }
  getId(): string { return this.id.toString(); }
  getActorKey(): string { return this.actorKey; }
  getReviewId(): string { return this.reviewId; }
  getTenantId(): string { return this.tenantId; }
  getVote(): ReviewVoteValue { return this.vote; }
  changeVote(vote: ReviewVoteValue): void { this.vote = vote; this.updatedAt = new Date(); }
}
