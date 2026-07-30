export interface ProductReader {
  getProduct(productId: string, tenantId: string): Promise<{ id: string; tenantId: string; name: string; slug: string; status: string; visibility: string; deletedAt: Date | null } | null>;
}

export interface ProductVariantReader {
  getVariant(productVariantId: string, tenantId: string): Promise<{ id: string; tenantId: string; productId: string; sku: string; name: string | null; status: string; deletedAt: Date | null } | null>;
}

export interface CustomerReader {
  exists(customerId: string, tenantId: string): Promise<boolean>;
  isActive(customerId: string, tenantId: string): Promise<boolean>;
  getDisplayName?(customerId: string, tenantId: string): Promise<string | null>;
}

export interface OrderReader {
  findVerifiedPurchase(customerId: string, productId: string, tenantId: string): Promise<{ orderId: string; orderItemId: string; productVariantId: string | null; status: string } | null>;
  isOrderAllowedForReview(orderId: string, tenantId: string): Promise<boolean>;
}

export interface EventPublisher { publish(event: unknown): Promise<void>; }
export interface Clock { now(): Date; }
export interface CurrentActor { getType(): string; getId(): string | null; }
export interface ContentSanitizer { sanitize(input: string): string; stripHtml(input: string): string; }
