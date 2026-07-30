import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import { Wishlist } from '../../../domain';
import type { WishlistRepository, WishlistListFilters, WishlistListResult } from '../../../domain';
import type { WishlistId } from '../../../domain';
import { PrismaWishlistMapper } from './mappers/prisma-wishlist.mapper';

@Injectable()
export class PrismaWishlistRepository implements WishlistRepository {
  constructor(@Inject('PRISMA_CLIENT_WISHLISTS') private readonly prisma: PrismaClient) {}

  async save(wishlist: Wishlist): Promise<Wishlist> { await this.prisma.wishlist.upsert({ where: { id: wishlist.getId() }, create: PrismaWishlistMapper.toPrisma(wishlist) as never, update: PrismaWishlistMapper.toPrisma(wishlist) as never }); return wishlist; }
  async findById(id: WishlistId, tenantId: string): Promise<Wishlist | null> { const raw = await this.prisma.wishlist.findFirst({ where: { id: id.toString(), tenantId }, include: { items: true } }); return raw ? PrismaWishlistMapper.toDomain(raw as never) : null; }
  async findDefaultByCustomer(customerId: string, tenantId: string): Promise<Wishlist | null> { const raw = await this.prisma.wishlist.findFirst({ where: { tenantId, customerId, isDefault: true, status: 'ACTIVE' }, include: { items: true } }); return raw ? PrismaWishlistMapper.toDomain(raw as never) : null; }
  async findActiveByGuestTokenHash(guestTokenHash: string, tenantId: string): Promise<Wishlist | null> { const raw = await this.prisma.wishlist.findFirst({ where: { tenantId, guestTokenHash, status: 'ACTIVE' }, include: { items: true } }); return raw ? PrismaWishlistMapper.toDomain(raw as never) : null; }
  async findByCustomerAndName(customerId: string, name: string, tenantId: string): Promise<Wishlist | null> { const raw = await this.prisma.wishlist.findFirst({ where: { tenantId, customerId, name, status: 'ACTIVE' }, include: { items: true } }); return raw ? PrismaWishlistMapper.toDomain(raw as never) : null; }
  async listByCustomer(customerId: string, tenantId: string, filters?: WishlistListFilters): Promise<WishlistListResult> { const limit = Math.min(filters?.limit ?? 20, 100); const offset = filters?.offset ?? 0; const [rows, total] = await Promise.all([this.prisma.wishlist.findMany({ where: { tenantId, customerId }, take: limit, skip: offset, orderBy: { createdAt: 'desc' }, include: { items: true } }), this.prisma.wishlist.count({ where: { tenantId, customerId } })]); return { items: rows.map(r => PrismaWishlistMapper.toDomain(r as never)), total, limit, offset }; }
  async findForUpdate(id: WishlistId, tenantId: string): Promise<Wishlist | null> { return this.findById(id, tenantId); }
  async listExpired(tenantId: string, before: Date): Promise<Wishlist[]> { const rows = await this.prisma.wishlist.findMany({ where: { tenantId, expiresAt: { lte: before }, status: 'ACTIVE' }, include: { items: true } }); return rows.map(r => PrismaWishlistMapper.toDomain(r as never)); }
}
