import { Body, Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { WishlistAppService } from '../../services';
import type { WishlistItemRequestDto } from '../dto';
import { AddWishlistItemCommand, RemoveWishlistItemCommand, MergeGuestWishlistCommand } from '../../application/commands';

@Controller('api/v1/wishlist')
export class GuestWishlistController {
  constructor(private readonly service: WishlistAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }
  private token(headers: Record<string, string>): string { return headers['x-guest-token'] || ''; }
  private customer(headers: Record<string, string>): string { return headers['x-customer-id'] || headers['x-user-id'] || ''; }

  @Get() get(@Headers() headers: Record<string, string>) { return this.service.getOrCreateGuestWishlist(this.token(headers), this.tenant(headers)); }
  @Post('items') add(@Headers() headers: Record<string, string>, @Body() dto: WishlistItemRequestDto) { const wishlist = this.service.getOrCreateGuestWishlist(this.token(headers), this.tenant(headers)); return wishlist.then(w => this.service.addWishlistItem(new AddWishlistItemCommand(this.tenant(headers), w.id, dto.productId, dto.productVariantId ?? null, dto.sku ?? null, dto.note ?? null, dto.priority))); }
  @Delete('items/:itemId') remove(@Headers() headers: Record<string, string>, @Param('itemId') itemId: string) { const wishlist = this.service.getOrCreateGuestWishlist(this.token(headers), this.tenant(headers)); return wishlist.then(w => this.service.removeWishlistItem(new RemoveWishlistItemCommand(this.tenant(headers), w.id, itemId))); }
  @Post('merge') merge(@Headers() headers: Record<string, string>) { return this.service.mergeGuestWishlistIntoCustomer(new MergeGuestWishlistCommand(this.tenant(headers), this.token(headers), this.customer(headers))); }
}
