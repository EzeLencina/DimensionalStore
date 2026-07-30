import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import { ProductReviewSummary } from '../../../domain';
import type { ReviewSummaryRepository } from '../../../domain';
import { ReviewPrismaMapper } from './review-prisma.mapper';

@Injectable()
export class PrismaReviewSummaryRepository implements ReviewSummaryRepository {
  constructor(@Inject('PRISMA_CLIENT_REVIEWS') private readonly prisma: PrismaClient) {}
  async save(summary: ProductReviewSummary): Promise<ProductReviewSummary> { await this.prisma.productReviewSummary.upsert({ where: { tenantId_productId: { tenantId: summary.getTenantId(), productId: summary.getProductId() } }, create: ReviewPrismaMapper.summaryToPrisma(summary) as never, update: ReviewPrismaMapper.summaryToPrisma(summary) as never }); return summary; }
  async findByProduct(productId: string, tenantId: string): Promise<ProductReviewSummary | null> { const raw = await this.prisma.productReviewSummary.findFirst({ where: { tenantId, productId } }); return raw ? ReviewPrismaMapper.summaryToDomain(raw as never) : null; }
  async recalculate(productId: string, tenantId: string): Promise<ProductReviewSummary> { const existing = await this.findByProduct(productId, tenantId); return existing ?? ProductReviewSummary.empty(tenantId, productId); }
}
