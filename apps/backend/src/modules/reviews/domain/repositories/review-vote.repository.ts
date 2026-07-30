import type { ReviewVote } from '../aggregates/review-vote.aggregate';

export interface ReviewVoteRepository {
  save(vote: ReviewVote): Promise<ReviewVote>;
  findByActorAndReview(reviewId: string, actorKey: string, tenantId: string): Promise<ReviewVote | null>;
  countByReview(reviewId: string, tenantId: string): Promise<{ helpful: number; notHelpful: number }>;
  delete(id: string, tenantId: string): Promise<void>;
}

export const REVIEW_VOTE_REPOSITORY = 'REVIEW_VOTE_REPOSITORY';
