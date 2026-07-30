export interface ProductVariantReader {
  isActive(productVariantId: string, tenantId: string): Promise<boolean>;
  getSku(productVariantId: string, tenantId: string): Promise<string | null>;
}

export interface PricingResolver {
  resolveEffectivePrice(productVariantId: string, tenantId: string): Promise<{ amount: number; currency: string }>;
}

export interface InventoryAvailabilityReader {
  getAvailableStock(productVariantId: string, tenantId: string): Promise<number>;
}

export interface CustomerReader {
  exists(customerId: string, tenantId: string): Promise<boolean>;
  isActive(customerId: string, tenantId: string): Promise<boolean>;
}

export interface Clock {
  now(): Date;
}
