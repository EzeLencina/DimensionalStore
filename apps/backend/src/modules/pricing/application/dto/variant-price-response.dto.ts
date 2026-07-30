export type VariantPriceResponseDto = {
  id: string; tenantId: string; priceListId: string;
  productVariantId: string; sku: string;
  costAmount: number | null; listAmount: number;
  saleAmount: number | null; promotionalAmount: number | null;
  promotionalStartsAt: string | null; promotionalEndsAt: string | null;
  minimumQuantity: number; effectivePrice: number;
  hasActivePromotion: boolean; deletedAt: string | null;
  version: number; createdAt: string; updatedAt: string;
};

export type EffectivePriceResponseDto = {
  variantPriceId: string; sku: string; priceListId: string;
  priceListName: string; effectiveAmount: number;
  currency: string; hasPromotion: boolean;
};
