import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import type { ReviewResponseRepository } from '../../../domain';
import type { ReviewResponse } from '../../../domain';
import { ReviewPrismaMapper } from './review-prisma.mapper';

@Injectable()
export class PrismaReviewResponseRepository implements ReviewResponseRepository {
  constructor(@Inject('PRISMA_CLIENT_REVIEWS') private readonly prisma: PrismaClient) {}
  async save(response: ReviewResponse): Promise<ReviewResponse> { await this.prisma.reviewResponse.upsert({ where: { reviewId: response.getReviewId() }, create: ReviewPrismaMapper.responseToPrisma(response) as never, update: ReviewPrismaMapper.responseToPrisma(response) as never }); return response; }
  async findByReview(reviewId: string, tenantId: string): Promise<ReviewResponse | null> { const raw = await this.prisma.reviewResponse.findFirst({ where: { reviewId, tenantId } }); return raw ? ReviewPrismaMapper.responseToDomain(raw as never) : null; }
  async softDelete(id: string, tenantId: string): Promise<void> { await this.prisma.reviewResponse.updateMany({ where: { id, tenantId }, data: { deletedAt: new Date() } }); }
}
