import type { ReviewVote } from '../../../domain';
import type { ReviewVoteRepository } from '../../../domain';

export class InMemoryReviewVoteRepository implements ReviewVoteRepository {
  private store = new Map<string, ReviewVote>();
  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }
  async save(vote: ReviewVote): Promise<ReviewVote> { this.store.set(this.key(vote.getId(), vote.getTenantId()), vote); return vote; }
  async findByActorAndReview(reviewId: string, actorKey: string, tenantId: string): Promise<ReviewVote | null> { return Array.from(this.store.values()).find(v => v.getTenantId() === tenantId && v.getReviewId() === reviewId && v.getActorKey() === actorKey) ?? null; }
  async countByReview(reviewId: string, tenantId: string): Promise<{ helpful: number; notHelpful: number }> { const votes = Array.from(this.store.values()).filter(v => v.getTenantId() === tenantId && v.getReviewId() === reviewId); return { helpful: votes.filter(v => v.getVote() === 'HELPFUL').length, notHelpful: votes.filter(v => v.getVote() === 'NOT_HELPFUL').length }; }
  async delete(id: string, tenantId: string): Promise<void> { this.store.delete(this.key(id, tenantId)); }
}
