import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import type { ReviewRepository, ReviewListFilters, ReviewListResult } from '../../../domain';
import type { ProductReview } from '../../../domain';
import { ReviewPrismaMapper } from './review-prisma.mapper';

@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
  constructor(@Inject('PRISMA_CLIENT_REVIEWS') private readonly prisma: PrismaClient) {}
  async save(review: ProductReview): Promise<ProductReview> { await this.prisma.productReview.upsert({ where: { id: review.getId() }, create: ReviewPrismaMapper.reviewToPrisma(review) as never, update: ReviewPrismaMapper.reviewToPrisma(review) as never }); return review; }
  async findById(id: string, tenantId: string): Promise<ProductReview | null> { const raw = await this.prisma.productReview.findFirst({ where: { id, tenantId } }); return raw ? ReviewPrismaMapper.reviewToDomain(raw as never) : null; }
  async findByCustomerAndProduct(customerId: string, productId: string, tenantId: string): Promise<ProductReview | null> { const raw = await this.prisma.productReview.findFirst({ where: { tenantId, customerId, productId } }); return raw ? ReviewPrismaMapper.reviewToDomain(raw as never) : null; }
  async existsByCustomerAndProduct(customerId: string, productId: string, tenantId: string): Promise<boolean> { return (await this.findByCustomerAndProduct(customerId, productId, tenantId)) !== null; }
  async listPublicByProduct(productId: string, tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult> { const [rows, total] = await Promise.all([this.prisma.productReview.findMany({ where: { tenantId, productId, status: 'APPROVED' as never, deletedAt: null }, take: filters?.limit ?? 20, skip: filters?.offset ?? 0, orderBy: { createdAt: 'desc' } }), this.prisma.productReview.count({ where: { tenantId, productId, status: 'APPROVED' as never, deletedAt: null } })]); return { items: rows.map(r => ReviewPrismaMapper.reviewToDomain(r as never)), total, limit: filters?.limit ?? 20, offset: filters?.offset ?? 0 }; }
  async listForModeration(tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult> { const [rows, total] = await Promise.all([this.prisma.productReview.findMany({ where: { tenantId, deletedAt: null }, take: filters?.limit ?? 20, skip: filters?.offset ?? 0, orderBy: { createdAt: 'desc' } }), this.prisma.productReview.count({ where: { tenantId, deletedAt: null } })]); return { items: rows.map(r => ReviewPrismaMapper.reviewToDomain(r as never)), total, limit: filters?.limit ?? 20, offset: filters?.offset ?? 0 }; }
  async listByCustomer(customerId: string, tenantId: string, filters?: ReviewListFilters): Promise<ReviewListResult> { const [rows, total] = await Promise.all([this.prisma.productReview.findMany({ where: { tenantId, customerId, deletedAt: null }, take: filters?.limit ?? 20, skip: filters?.offset ?? 0, orderBy: { createdAt: 'desc' } }), this.prisma.productReview.count({ where: { tenantId, customerId, deletedAt: null } })]); return { items: rows.map(r => ReviewPrismaMapper.reviewToDomain(r as never)), total, limit: filters?.limit ?? 20, offset: filters?.offset ?? 0 }; }
  async findForUpdate(id: string, tenantId: string): Promise<ProductReview | null> { return this.findById(id, tenantId); }
  async countByStatus(tenantId: string, status: string): Promise<number> { return this.prisma.productReview.count({ where: { tenantId, status: status as never } }); }
}
