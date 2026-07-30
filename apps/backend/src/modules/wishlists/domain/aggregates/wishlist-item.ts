import { WishlistItemId, WishlistPriority } from '../value-objects';

export type WishlistItemPrimitives = {
  id: string; tenantId: string; wishlistId: string; productId: string; productVariantId: string | null; sku: string | null;
  itemKey: string; note: string | null; priority: string; addedAt: Date; createdAt: Date; updatedAt: Date; deletedAt: Date | null;
};

export class WishlistItem {
  private id!: WishlistItemId;
  constructor(
    private tenantId: string,
    private wishlistId: string,
    private productId: string,
    private productVariantId: string | null,
    private sku: string | null,
    private itemKey: string,
    private note: string | null,
    private priority: WishlistPriority,
    private addedAt: Date = new Date(),
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    private deletedAt: Date | null = null,
  ) { this.id = new WishlistItemId(); }

  static create(params: {
    tenantId: string; wishlistId: string; productId: string; productVariantId?: string | null; sku?: string | null; note?: string | null; priority?: string;
  }): WishlistItem {
    const itemKey = WishlistItem.makeKey(params.productId, params.productVariantId ?? null);
    return new WishlistItem(params.tenantId, params.wishlistId, params.productId, params.productVariantId ?? null, params.sku ?? null, itemKey, params.note ?? null, WishlistPriority.create(params.priority), new Date(), new Date(), new Date());
  }

  static fromPrimitives(p: WishlistItemPrimitives): WishlistItem {
    const item = new WishlistItem(p.tenantId, p.wishlistId, p.productId, p.productVariantId, p.sku, p.itemKey, p.note, WishlistPriority.create(p.priority), p.addedAt, p.createdAt, p.updatedAt, p.deletedAt);
    (item as unknown as { id: WishlistItemId }).id = new WishlistItemId(p.id);
    return item;
  }

  static makeKey(productId: string, productVariantId: string | null): string { return `${productId}:${productVariantId ?? 'NO_VARIANT'}`; }

  toPrimitives(): WishlistItemPrimitives {
    return { id: this.id.toString(), tenantId: this.tenantId, wishlistId: this.wishlistId, productId: this.productId, productVariantId: this.productVariantId, sku: this.sku, itemKey: this.itemKey, note: this.note, priority: this.priority.toString(), addedAt: this.addedAt, createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt };
  }

  getId(): string { return this.id.toString(); }
  getItemKey(): string { return this.itemKey; }
  getTenantId(): string { return this.tenantId; }
  getWishlistId(): string { return this.wishlistId; }
  getProductId(): string { return this.productId; }
  getProductVariantId(): string | null { return this.productVariantId; }
  getSku(): string | null { return this.sku; }
  getPriority(): WishlistPriority { return this.priority; }
  getNote(): string | null { return this.note; }
  getAddedAt(): Date { return this.addedAt; }
  isDeleted(): boolean { return this.deletedAt !== null; }

  updateNote(note: string | null): void { this.note = note; this.updatedAt = new Date(); }
  changePriority(priority: WishlistPriority): void { this.priority = priority; this.updatedAt = new Date(); }
  softDelete(now: Date): void { this.deletedAt = now; this.updatedAt = now; }
}
