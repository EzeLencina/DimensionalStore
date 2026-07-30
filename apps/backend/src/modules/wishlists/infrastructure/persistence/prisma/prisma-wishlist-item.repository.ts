import { Injectable, Inject } from '@nestjs/common';
import type { Prisma, PrismaClient } from '@tienda/database';
import { WishlistItem } from '../../../domain';
import type { WishlistItemRepository } from '../../../domain';

type PrismaWishlistItem = Prisma.WishlistItemGetPayload<Record<string, never>>;

@Injectable()
export class PrismaWishlistItemRepository implements WishlistItemRepository {
  constructor(@Inject('PRISMA_CLIENT_WISHLISTS') private readonly prisma: PrismaClient) {}
  async save(item: WishlistItem): Promise<WishlistItem> {
    const p = item.toPrimitives();
    const create: Prisma.WishlistItemUncheckedCreateInput = { ...p, priority: item.getPriority().getValue() };
    const update: Prisma.WishlistItemUncheckedUpdateInput = { ...p, priority: item.getPriority().getValue() };
    await this.prisma.wishlistItem.upsert({ where: { id: item.getId() }, create, update });
    return item;
  }
  async findById(id: string, tenantId: string): Promise<WishlistItem | null> { const raw: PrismaWishlistItem | null = await this.prisma.wishlistItem.findFirst({ where: { id, tenantId } }); return raw ? WishlistItem.fromPrimitives(raw) : null; }
  async exists(wishlistId: string, itemKey: string, tenantId: string): Promise<boolean> { return (await this.prisma.wishlistItem.findFirst({ where: { wishlistId, itemKey, tenantId, deletedAt: null } })) !== null; }
  async listByWishlist(wishlistId: string, tenantId: string): Promise<WishlistItem[]> { const rows: PrismaWishlistItem[] = await this.prisma.wishlistItem.findMany({ where: { wishlistId, tenantId, deletedAt: null } }); return rows.map((row: PrismaWishlistItem) => WishlistItem.fromPrimitives(row)); }
  async softDelete(id: string, tenantId: string): Promise<void> { await this.prisma.wishlistItem.updateMany({ where: { id, tenantId }, data: { deletedAt: new Date() } }); }
}
