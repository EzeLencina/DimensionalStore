import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import { WishlistItem } from '../../../domain';
import type { WishlistItemRepository } from '../../../domain';

@Injectable()
export class PrismaWishlistItemRepository implements WishlistItemRepository {
  constructor(@Inject('PRISMA_CLIENT_WISHLISTS') private readonly prisma: PrismaClient) {}
  async save(item: WishlistItem): Promise<WishlistItem> { await this.prisma.wishlistItem.upsert({ where: { id: item.getId() }, create: item.toPrimitives() as never, update: item.toPrimitives() as never }); return item; }
  async findById(id: string, tenantId: string): Promise<WishlistItem | null> { const raw = await this.prisma.wishlistItem.findFirst({ where: { id, tenantId } }); return raw ? WishlistItem.fromPrimitives(raw as never) : null; }
  async exists(wishlistId: string, itemKey: string, tenantId: string): Promise<boolean> { return (await this.prisma.wishlistItem.findFirst({ where: { wishlistId, itemKey, tenantId, deletedAt: null } })) !== null; }
  async listByWishlist(wishlistId: string, tenantId: string): Promise<WishlistItem[]> { const rows = await this.prisma.wishlistItem.findMany({ where: { wishlistId, tenantId, deletedAt: null } }); return rows.map(r => WishlistItem.fromPrimitives(r as never)); }
  async softDelete(id: string, tenantId: string): Promise<void> { await this.prisma.wishlistItem.updateMany({ where: { id, tenantId }, data: { deletedAt: new Date() } }); }
}
