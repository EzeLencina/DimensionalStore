import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { WishlistAppService } from '../../services';
import type { CreateWishlistRequestDto, WishlistItemRequestDto, UpdateWishlistItemRequestDto } from '../dto';
import {
  CreateWishlistCommand, GetWishlistCommand, ListWishlistsCommand, RenameWishlistCommand, SetDefaultWishlistCommand, ArchiveWishlistCommand,
  RestoreWishlistCommand, ClearWishlistCommand, AddWishlistItemCommand, RemoveWishlistItemCommand, UpdateWishlistItemCommand,
  MoveWishlistItemToCartCommand, AddAllAvailableItemsToCartCommand,
} from '../../application/commands';

@Controller('api/v1/account/wishlists')
export class AccountWishlistController {
  constructor(private readonly service: WishlistAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }
  private customer(headers: Record<string, string>): string { return headers['x-customer-id'] || headers['x-user-id'] || ''; }

  @Get() list(@Headers() headers: Record<string, string>) { return this.service.listWishlists(new ListWishlistsCommand(this.tenant(headers), this.customer(headers))); }
  @Post() create(@Headers() headers: Record<string, string>, @Body() dto: CreateWishlistRequestDto) { return this.service.createWishlist(new CreateWishlistCommand(this.tenant(headers), this.customer(headers), dto.name ?? 'Favoritos', dto.isDefault ?? false)); }
  @Get(':id') get(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.getWishlist(new GetWishlistCommand(this.tenant(headers), id)); }
  @Patch(':id') rename(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body('name') name: string) { return this.service.renameWishlist(new RenameWishlistCommand(this.tenant(headers), id, name)); }
  @Post(':id/default') default(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.setDefaultWishlist(new SetDefaultWishlistCommand(this.tenant(headers), id)); }
  @Post(':id/archive') archive(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.archiveWishlist(new ArchiveWishlistCommand(this.tenant(headers), id)); }
  @Post(':id/restore') restore(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.restoreWishlist(new RestoreWishlistCommand(this.tenant(headers), id)); }
  @Delete(':id/items') clear(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.clearWishlist(new ClearWishlistCommand(this.tenant(headers), id)); }
  @Post(':id/items') addItem(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: WishlistItemRequestDto) { return this.service.addWishlistItem(new AddWishlistItemCommand(this.tenant(headers), id, dto.productId, dto.productVariantId ?? null, dto.sku ?? null, dto.note ?? null, dto.priority)); }
  @Patch(':id/items/:itemId') updateItem(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('itemId') itemId: string, @Body() dto: UpdateWishlistItemRequestDto) { return this.service.updateWishlistItem(new UpdateWishlistItemCommand(this.tenant(headers), id, itemId, dto.note ?? null, dto.priority)); }
  @Delete(':id/items/:itemId') removeItem(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('itemId') itemId: string) { return this.service.removeWishlistItem(new RemoveWishlistItemCommand(this.tenant(headers), id, itemId)); }
  @Post(':id/items/:itemId/move-to-cart') move(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('itemId') itemId: string) { return this.service.moveWishlistItemToCart(new MoveWishlistItemToCartCommand(this.tenant(headers), id, itemId, this.customer(headers) || null)); }
  @Post(':id/add-available-to-cart') addAvailable(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.addAllAvailableItemsToCart(new AddAllAvailableItemsToCartCommand(this.tenant(headers), id, this.customer(headers) || null)); }
}
