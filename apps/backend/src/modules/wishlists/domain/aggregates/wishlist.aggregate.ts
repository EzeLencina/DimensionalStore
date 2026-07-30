import { WishlistId, WishlistName, WishlistStatus, GuestWishlistToken, WishlistPriority, type WishlistPriorityValue } from '../value-objects';
import { WishlistItem, type WishlistItemPrimitives } from './wishlist-item';
import { WishlistException, WISHLIST_ERROR_CODES } from '../exceptions';

export type WishlistPrimitives = {
  id: string; tenantId: string; customerId: string | null; guestTokenHash: string | null; name: string; status: string; isDefault: boolean; expiresAt: Date | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null; version: number; items: WishlistItemPrimitives[];
};

type CreateDefaultParams = { tenantId: string; customerId?: string | null; guestToken?: GuestWishlistToken | null; name?: string; expiresAt?: Date | null; isDefault?: boolean };

export class Wishlist {
  private id!: WishlistId;
  private tenantId!: string;
  private customerId: string | null = null;
  private guestTokenHash: string | null = null;
  private name!: string;
  private status!: WishlistStatus;
  private isDefault = false;
  private expiresAt: Date | null = null;
  private createdAt!: Date;
  private updatedAt!: Date;
  private deletedAt: Date | null = null;
  private version = 1;
  private items: WishlistItem[] = [];

  private constructor() {}

  static createDefault(params: CreateDefaultParams): Wishlist {
    const wishlist = new Wishlist();
    wishlist.id = new WishlistId(); wishlist.tenantId = params.tenantId; wishlist.customerId = params.customerId ?? null; wishlist.guestTokenHash = params.guestToken?.getHash() ?? null;
    wishlist.name = new WishlistName(params.name ?? 'Favoritos').toString(); wishlist.status = WishlistStatus.ACTIVE(); wishlist.isDefault = params.isDefault ?? true;
    wishlist.expiresAt = params.expiresAt ?? null; wishlist.createdAt = new Date(); wishlist.updatedAt = new Date();
    return wishlist;
  }

  static createNamed(params: { tenantId: string; customerId: string; name: string; isDefault?: boolean }): Wishlist {
    const wishlist = Wishlist.createDefault({ tenantId: params.tenantId, customerId: params.customerId, name: params.name, isDefault: params.isDefault ?? false });
    return wishlist;
  }

  static fromPrimitives(p: WishlistPrimitives): Wishlist {
    const wishlist = new Wishlist();
    wishlist.id = new WishlistId(p.id); wishlist.tenantId = p.tenantId; wishlist.customerId = p.customerId; wishlist.guestTokenHash = p.guestTokenHash; wishlist.name = new WishlistName(p.name).toString();
    wishlist.status = WishlistStatus.create(p.status); wishlist.isDefault = p.isDefault; wishlist.expiresAt = p.expiresAt; wishlist.createdAt = p.createdAt; wishlist.updatedAt = p.updatedAt; wishlist.deletedAt = p.deletedAt; wishlist.version = p.version;
    wishlist.items = p.items.map(i => WishlistItem.fromPrimitives(i));
    return wishlist;
  }

  toPrimitives(): WishlistPrimitives {
    return { id: this.id.toString(), tenantId: this.tenantId, customerId: this.customerId, guestTokenHash: this.guestTokenHash, name: this.name, status: this.status.toString(), isDefault: this.isDefault, expiresAt: this.expiresAt, createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt, version: this.version, items: this.items.map(i => i.toPrimitives()) };
  }

  getId(): string { return this.id.toString(); }
  getTenantId(): string { return this.tenantId; }
  getCustomerId(): string | null { return this.customerId; }
  getGuestTokenHash(): string | null { return this.guestTokenHash; }
  getName(): string { return this.name; }
  getStatus(): WishlistStatus { return this.status; }
  getIsDefault(): boolean { return this.isDefault; }
  getExpiresAt(): Date | null { return this.expiresAt; }
  getItems(): WishlistItem[] { return [...this.items]; }
  isGuest(): boolean { return this.customerId === null; }
  isActive(): boolean { return this.status.toString() === 'ACTIVE'; }
  isArchived(): boolean { return this.status.toString() === 'ARCHIVED'; }
  isExpired(): boolean { return this.status.toString() === 'EXPIRED'; }

  rename(name: string): void { this.assertMutable(); this.name = new WishlistName(name).toString(); this.touch(); }
  setDefault(): void { this.assertMutable(); this.isDefault = true; this.touch(); }
  archive(): void { if (!this.status.canTransitionTo('ARCHIVED')) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_ACTIVE, 'Cannot archive wishlist'); this.status = WishlistStatus.ARCHIVED(); this.touch(); }
  restore(): void { this.status = WishlistStatus.ACTIVE(); this.deletedAt = null; this.touch(); }
  expire(now: Date): void { this.status = WishlistStatus.EXPIRED(); this.expiresAt = now; this.touch(); }
  softDelete(now: Date): void { this.status = WishlistStatus.DELETED(); this.deletedAt = now; this.touch(); }
  clear(): void { this.assertMutable(); this.items = []; this.touch(); }

  addItem(item: WishlistItem): void {
    this.assertMutable();
    if (this.items.find(i => i.getItemKey() === item.getItemKey() && !i.isDeleted())) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_ITEM_ALREADY_EXISTS, 'Item already exists');
    this.items.push(item);
    this.touch();
  }

  removeItem(itemId: string): void { this.assertMutable(); this.items = this.items.filter(i => i.getId() !== itemId); this.touch(); }
  updateItemNote(itemId: string, note: string | null): void { this.assertMutable(); const item = this.items.find(i => i.getId() === itemId); if (!item) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_ITEM_NOT_FOUND, 'Item not found'); item.updateNote(note); this.touch(); }
  changeItemPriority(itemId: string, priority: WishlistPriorityValue): void { this.assertMutable(); const item = this.items.find(i => i.getId() === itemId); if (!item) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_ITEM_NOT_FOUND, 'Item not found'); item.changePriority(WishlistPriority.create(priority)); this.touch(); }

  merge(source: Wishlist): void {
    this.assertMutable();
    for (const item of source.getItems()) {
      const exists = this.items.find(i => i.getItemKey() === item.getItemKey());
      if (!exists) this.items.push(item);
      else if (item.getPriority().rank() > exists.getPriority().rank()) exists.changePriority(item.getPriority());
    }
    this.touch();
  }

  setExpiredIfPast(now: Date): boolean { if (this.expiresAt && now > this.expiresAt && this.isActive()) { this.expire(now); return true; } return false; }

  private assertMutable(): void { if (!this.status.isMutable()) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_ACTIVE, `Wishlist is ${this.status}`); if (this.deletedAt) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_ARCHIVED, 'Wishlist deleted'); }
  private touch(): void { this.updatedAt = new Date(); this.version++; }
}
