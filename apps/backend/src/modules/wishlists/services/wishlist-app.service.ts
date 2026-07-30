import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { GuestWishlistToken, Wishlist, WishlistItem, WishlistException, WISHLIST_ERROR_CODES, WishlistPriority, WishlistId } from '../domain';
import { WISHLIST_REPOSITORY, WISHLIST_ITEM_REPOSITORY } from '../domain';
import type { WishlistRepository, WishlistItemRepository, WishlistListFilters } from '../domain';
import type { ProductReader, ProductVariantReader, PricingResolver, InventoryAvailabilityReader, CartService, CustomerReader, Clock, CurrentActor } from '../domain';
import { WishlistMapper } from '../application/mappers';
import type { WishlistResponseDto, WishlistListResponseDto } from '../application/dto';
import {
  CreateWishlistCommand, GetWishlistCommand, ListWishlistsCommand, RenameWishlistCommand, SetDefaultWishlistCommand, ArchiveWishlistCommand,
  RestoreWishlistCommand, ClearWishlistCommand, AddWishlistItemCommand, RemoveWishlistItemCommand, UpdateWishlistItemCommand, MoveWishlistItemToCartCommand,
  AddAllAvailableItemsToCartCommand, MergeGuestWishlistCommand, ExpireGuestWishlistsCommand,
} from '../application/commands';
import { WishlistValidator } from '../application/validators';
import { WISHLIST_DEFAULT_NAME, WISHLIST_MAX_ITEMS_PER_LIST, WISHLIST_GUEST_EXPIRATION_DAYS } from '../constants';

type EnrichedItem = { item: WishlistItem; productName?: string | null; variantName?: string | null; slug?: string | null; primaryImage?: string | null; currentPrice?: number | null; currency?: string | null; inStock?: boolean | null; availableQuantity?: number | null; purchasable?: boolean | null };

@Injectable()
export class WishlistAppService {
  constructor(
    @Inject(WISHLIST_REPOSITORY) private readonly wishlistRepo: WishlistRepository,
    @Inject(WISHLIST_ITEM_REPOSITORY) private readonly itemRepo: WishlistItemRepository,
    @Inject('PRODUCT_READER') private readonly productReader: ProductReader,
    @Inject('PRODUCT_VARIANT_READER') private readonly productVariantReader: ProductVariantReader,
    @Inject('PRICING_RESOLVER') private readonly pricingResolver: PricingResolver,
    @Inject('INVENTORY_AVAILABILITY_READER') private readonly inventoryReader: InventoryAvailabilityReader,
    @Inject('CART_SERVICE') private readonly cartService: CartService,
    @Inject('CUSTOMER_READER') private readonly customerReader: CustomerReader,
    @Inject('CLOCK_WISHLISTS') private readonly clock: Clock,
    @Inject('CURRENT_ACTOR_WISHLISTS') private readonly actor: CurrentActor,
    @Inject(LOGGER_TOKEN) private readonly logger: { info: (...args: unknown[]) => void; warn?: (...args: unknown[]) => void; error?: (...args: unknown[]) => void },
  ) {}

  private async assertCustomer(customerId: string, tenantId: string): Promise<void> {
    if (!(await this.customerReader.exists(customerId, tenantId))) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_CUSTOMER_MISMATCH, 'Customer mismatch');
  }

  private async enrichWishlist(wishlist: Wishlist): Promise<EnrichedItem[]> {
    return Promise.all(wishlist.getItems().map(async item => {
      const [product, variant, price, stock] = await Promise.all([
        this.productReader.getProduct(item.getProductId(), wishlist.getTenantId()),
        item.getProductVariantId() ? this.productVariantReader.getVariant(item.getProductVariantId()!, wishlist.getTenantId()) : Promise.resolve(null),
        item.getProductVariantId() ? this.pricingResolver.resolveEffectivePrice(item.getProductVariantId()!, wishlist.getTenantId()) : Promise.resolve(null),
        item.getProductVariantId() ? this.inventoryReader.getAvailableStock(item.getProductVariantId()!, wishlist.getTenantId()) : Promise.resolve(null),
      ]);
      return {
        item, productName: product?.name ?? null, variantName: variant?.name ?? null, slug: product?.slug ?? null, primaryImage: product?.primaryImage ?? null,
        currentPrice: price?.amount ?? null, currency: price?.currency ?? null, inStock: stock !== null ? stock > 0 : null, availableQuantity: stock ?? null,
        purchasable: stock !== null ? stock > 0 : null,
      };
    }));
  }

  private async persist(wishlist: Wishlist): Promise<Wishlist> { return this.wishlistRepo.save(wishlist); }

  async getOrCreateDefaultWishlist(customerId: string, tenantId: string): Promise<WishlistResponseDto> {
    await this.assertCustomer(customerId, tenantId);
    const existing = await this.wishlistRepo.findDefaultByCustomer(customerId, tenantId);
    if (existing) return WishlistMapper.toResponse(existing, await this.enrichWishlist(existing));
    const wishlist = Wishlist.createDefault({ tenantId, customerId, name: WISHLIST_DEFAULT_NAME, isDefault: true });
    await this.persist(wishlist);
    return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist));
  }

  async getOrCreateGuestWishlist(guestToken: string, tenantId: string): Promise<WishlistResponseDto> {
    const token = new GuestWishlistToken(guestToken);
    const existing = await this.wishlistRepo.findActiveByGuestTokenHash(token.getHash(), tenantId);
    if (existing) return WishlistMapper.toResponse(existing, await this.enrichWishlist(existing));
    const wishlist = Wishlist.createDefault({ tenantId, guestToken: token, name: WISHLIST_DEFAULT_NAME, isDefault: true });
    await this.persist(wishlist);
    return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist));
  }

  async createWishlist(command: CreateWishlistCommand): Promise<WishlistResponseDto> {
    const errors = WishlistValidator.validateCreate(command);
    if (errors.length) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_ACTIVE, errors.join('; '));
    const count = (await this.wishlistRepo.listByCustomer(command.customerId, command.tenantId)).total;
    if (count >= 10) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_LIMIT_EXCEEDED, 'Too many wishlists');
    const wishlist = Wishlist.createNamed({ tenantId: command.tenantId, customerId: command.customerId, name: command.name, isDefault: command.isDefault });
    await this.persist(wishlist);
    return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist));
  }

  async getWishlist(command: GetWishlistCommand): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId);
    if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found');
    return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist));
  }

  async listWishlists(command: ListWishlistsCommand): Promise<WishlistListResponseDto> {
    const result = await this.wishlistRepo.listByCustomer(command.customerId, command.tenantId, { limit: 50, offset: 0 });
    return { items: await Promise.all(result.items.map(async w => WishlistMapper.toResponse(w, await this.enrichWishlist(w)))), total: result.total, limit: result.limit, offset: result.offset };
  }

  async renameWishlist(command: RenameWishlistCommand): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId);
    if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found');
    wishlist.rename(command.name);
    await this.persist(wishlist);
    return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist));
  }

  async setDefaultWishlist(command: SetDefaultWishlistCommand): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId);
    if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found');
    wishlist.setDefault();
    await this.persist(wishlist);
    return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist));
  }

  async archiveWishlist(command: ArchiveWishlistCommand): Promise<WishlistResponseDto> { const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId); if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found'); wishlist.archive(); await this.persist(wishlist); return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist)); }
  async restoreWishlist(command: RestoreWishlistCommand): Promise<WishlistResponseDto> { const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId); if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found'); wishlist.restore(); await this.persist(wishlist); return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist)); }
  async clearWishlist(command: ClearWishlistCommand): Promise<WishlistResponseDto> { const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId); if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found'); wishlist.clear(); await this.persist(wishlist); return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist)); }

  async addWishlistItem(command: AddWishlistItemCommand): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId); if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found');
    const product = await this.productReader.getProduct(command.productId, command.tenantId); if (!product || product.status !== 'ACTIVE' || product.visibility === 'HIDDEN' || product.deletedAt) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_PRODUCT_NOT_AVAILABLE, 'Product not available');
    let sku: string | null = command.sku ?? null; let variantId: string | null = command.productVariantId ?? null;
    if (variantId) {
      const variant = await this.productVariantReader.getVariant(variantId, command.tenantId); if (!variant || variant.productId !== command.productId || variant.status !== 'ACTIVE' || variant.deletedAt) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_VARIANT_NOT_AVAILABLE, 'Variant not available');
      sku = variant.sku;
    }
    const item = WishlistItem.create({ tenantId: command.tenantId, wishlistId: command.wishlistId, productId: command.productId, productVariantId: variantId, sku, note: command.note ?? null, priority: command.priority });
    if (await this.itemRepo.exists(command.wishlistId, item.getItemKey(), command.tenantId)) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_ITEM_ALREADY_EXISTS, 'Duplicate item');
    if (wishlist.getItems().length >= WISHLIST_MAX_ITEMS_PER_LIST) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_ITEM_LIMIT_EXCEEDED, 'Too many items');
    wishlist.addItem(item); await this.itemRepo.save(item); await this.persist(wishlist);
    return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist));
  }

  async removeWishlistItem(command: RemoveWishlistItemCommand): Promise<WishlistResponseDto> { const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId); if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found'); wishlist.removeItem(command.itemId); await this.itemRepo.softDelete(command.itemId, command.tenantId); await this.persist(wishlist); return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist)); }
  async updateWishlistItem(command: UpdateWishlistItemCommand): Promise<WishlistResponseDto> { const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId); if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found'); if (command.note !== undefined) wishlist.updateItemNote(command.itemId, command.note); if (command.priority) wishlist.changeItemPriority(command.itemId, command.priority); await this.persist(wishlist); return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist)); }

  async moveWishlistItemToCart(command: MoveWishlistItemToCartCommand): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId); if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found');
    const item = wishlist.getItems().find(i => i.getId() === command.itemId); if (!item) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_ITEM_NOT_FOUND, 'Item not found');
    if (!item.getProductVariantId()) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_VARIANT_REQUIRED, 'Variant required');
    const variant = await this.productVariantReader.getVariant(item.getProductVariantId()!, command.tenantId); if (!variant) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_VARIANT_NOT_AVAILABLE, 'Variant not available');
    const price = await this.pricingResolver.resolveEffectivePrice(item.getProductVariantId()!, command.tenantId); const stock = await this.inventoryReader.getAvailableStock(item.getProductVariantId()!, command.tenantId); if (stock <= 0) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_INSUFFICIENT_STOCK, 'Insufficient stock');
    await this.cartService.addItem({ tenantId: command.tenantId, customerId: command.customerId, productVariantId: item.getProductVariantId()!, quantity: 1, note: item.getNote() });
    wishlist.removeItem(item.getId()); await this.itemRepo.softDelete(item.getId(), command.tenantId); await this.persist(wishlist);
    return WishlistMapper.toResponse(wishlist, await this.enrichWishlist(wishlist));
  }

  async addAllAvailableItemsToCart(command: AddAllAvailableItemsToCartCommand): Promise<{ moved: string[]; skipped: string[] }> {
    const wishlist = await this.wishlistRepo.findById(new WishlistId(command.wishlistId), command.tenantId); if (!wishlist) throw new WishlistException(WISHLIST_ERROR_CODES.WISHLIST_NOT_FOUND, 'Wishlist not found');
    const moved: string[] = []; const skipped: string[] = [];
    for (const item of wishlist.getItems()) {
      if (!item.getProductVariantId()) { skipped.push(item.getId()); continue; }
      const stock = await this.inventoryReader.getAvailableStock(item.getProductVariantId()!, command.tenantId);
      if (stock <= 0) { skipped.push(item.getId()); continue; }
      await this.cartService.addItem({ tenantId: command.tenantId, customerId: command.customerId, productVariantId: item.getProductVariantId()!, quantity: 1, note: item.getNote() });
      await this.itemRepo.softDelete(item.getId(), command.tenantId);
      wishlist.removeItem(item.getId());
      moved.push(item.getId());
    }
    await this.persist(wishlist);
    return { moved, skipped };
  }

  async mergeGuestWishlistIntoCustomer(command: MergeGuestWishlistCommand): Promise<WishlistResponseDto> {
    const guestHash = new GuestWishlistToken(command.guestToken).getHash();
    const guest = await this.wishlistRepo.findActiveByGuestTokenHash(guestHash, command.tenantId);
    const customer = await this.wishlistRepo.findDefaultByCustomer(command.customerId, command.tenantId) ?? Wishlist.createDefault({ tenantId: command.tenantId, customerId: command.customerId, name: WISHLIST_DEFAULT_NAME, isDefault: true });
    if (!guest) return WishlistMapper.toResponse(customer, await this.enrichWishlist(customer));
    customer.merge(guest);
    guest.archive();
    await this.persist(customer); await this.persist(guest);
    return WishlistMapper.toResponse(customer, await this.enrichWishlist(customer));
  }

  async expireGuestWishlists(command: ExpireGuestWishlistsCommand): Promise<number> {
    const now = this.clock.now();
    const expiring = await this.wishlistRepo.listExpired(command.tenantId, now);
    let expired = 0;
    for (const wishlist of expiring) { wishlist.expire(now); await this.persist(wishlist); expired++; }
    return expired;
  }
}
