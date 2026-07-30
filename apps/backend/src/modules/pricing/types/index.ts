export type PricingConfig = {
  defaultCurrency: string;
  allowedCurrencies: string[];
  enablePromotions: boolean;
};

export type ResolveEffectivePriceOptions = {
  tenantId: string;
  productVariantId: string;
  date?: Date;
  channel?: string;
  customerGroup?: string;
  quantity?: number;
};
