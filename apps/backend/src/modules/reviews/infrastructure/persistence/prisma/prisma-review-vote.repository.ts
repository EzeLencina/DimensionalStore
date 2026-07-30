import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import type { ReviewVoteRepository } from '../../../domain';
import type { ReviewVote } from '../../../domain';
import { ReviewPrismaMapper } from './review-prisma.mapper';

@Injectable()
export class PrismaReviewVoteRepository implements ReviewVoteRepository {
  constructor(@Inject('PRISMA_CLIENT_REVIEWS') private readonly prisma: PrismaClient) {}
  async save(vote: ReviewVote): Promise<ReviewVote> { await this.prisma.reviewVote.upsert({ where: { id: vote.getId() }, create: ReviewPrismaMapper.voteToPrisma(vote) as never, update: ReviewPrismaMapper.voteToPrisma(vote) as never }); return vote; }
  async findByActorAndReview(reviewId: string, actorKey: string, tenantId: string): Promise<ReviewVote | null> { const raw = await this.prisma.reviewVote.findFirst({ where: { reviewId, actorKey, tenantId } }); return raw ? ReviewPrismaMapper.voteToDomain(raw as never) : null; }
  async countByReview(reviewId: string, tenantId: string): Promise<{ helpful: number; notHelpful: number }> { const helpful = await this.prisma.reviewVote.count({ where: { tenantId, reviewId, vote: 'HELPFUL' } }); const notHelpful = await this.prisma.reviewVote.count({ where: { tenantId, reviewId, vote: 'NOT_HELPFUL' } }); return { helpful, notHelpful }; }
  async delete(id: string, tenantId: string): Promise<void> { await this.prisma.reviewVote.deleteMany({ where: { id, tenantId } }); }
}
