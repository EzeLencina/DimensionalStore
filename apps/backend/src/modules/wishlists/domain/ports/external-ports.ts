export interface ProductReader {
  getProduct(productId: string, tenantId: string): Promise<{ id: string; tenantId: string; name: string; slug: string; status: string; visibility: string; deletedAt: Date | null; primaryImage?: string | null } | null>;
}

export interface ProductVariantReader {
  getVariant(variantId: string, tenantId: string): Promise<{ id: string; tenantId: string; productId: string; sku: string; status: string; deletedAt: Date | null; name?: string | null } | null>;
  getVariantsByProduct(productId: string, tenantId: string): Promise<Array<{ id: string; tenantId: string; productId: string; sku: string; status: string; deletedAt: Date | null; name?: string | null }>>;
}

export interface PricingResolver {
  resolveEffectivePrice(productVariantId: string, tenantId: string): Promise<{ amount: number; currency: string }>;
}

export interface InventoryAvailabilityReader {
  getAvailableStock(productVariantId: string, tenantId: string): Promise<number>;
}

export interface CartService {
  addItem(params: { tenantId: string; customerId: string | null; productVariantId: string; quantity: number; note?: string | null }): Promise<{ cartId: string }>;
}

export interface CustomerReader {
  exists(customerId: string, tenantId: string): Promise<boolean>;
  isActive(customerId: string, tenantId: string): Promise<boolean>;
}

export interface Clock { now(): Date; }
export interface CurrentActor { getType(): string; getId(): string | null; }
