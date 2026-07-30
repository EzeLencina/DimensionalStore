import type { VariantPrice } from '../../domain';
import type { VariantPriceResponseDto, EffectivePriceResponseDto } from '../dto';

export class VariantPriceMapper {
  static toResponse(vp: VariantPrice): VariantPriceResponseDto {
    const p = vp.toPrimitives();
    const now = new Date();
    return {
      id: p.id, tenantId: p.tenantId, priceListId: p.priceListId,
      productVariantId: p.productVariantId, sku: p.sku,
      costAmount: p.costAmount, listAmount: p.listAmount,
      saleAmount: p.saleAmount,
      promotionalAmount: p.promotionalAmount,
      promotionalStartsAt: p.promotionalStartsAt?.toISOString() ?? null,
      promotionalEndsAt: p.promotionalEndsAt?.toISOString() ?? null,
      minimumQuantity: p.minimumQuantity,
      effectivePrice: vp.getEffectivePrice(now).toCents(),
      hasActivePromotion: vp.hasActivePromotion(now),
      deletedAt: p.deletedAt?.toISOString() ?? null,
      version: p.version, createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  static toEffectivePrice(vp: VariantPrice, priceListName: string): EffectivePriceResponseDto {
    const now = new Date();
    return {
      variantPriceId: vp.getId().toString(), sku: vp.getSku(),
      priceListId: vp.getPriceListId(), priceListName,
      effectiveAmount: vp.getEffectivePrice(now).toCents(),
      currency: 'ARS', hasPromotion: vp.hasActivePromotion(now),
    };
  }
}
