export interface CartReader {
  getCart(cartId: string, tenantId: string): Promise<{ id: string; tenantId: string; customerId: string | null; guestTokenHash: string | null; status: string; currency: string; items: Array<{ id: string; productVariantId: string; sku: string; quantity: number; unitPriceSnapshot: number }>; version: number } | null>;
}

export interface PricingResolver {
  resolveEffectivePrice(productVariantId: string, tenantId: string): Promise<{ amount: number; currency: string }>;
}

export interface InventoryReservationService {
  reserve(productVariantId: string, tenantId: string, quantity: number, reference: string): Promise<void>;
  releaseReservation(reference: string, tenantId: string): Promise<void>;
}

export interface ProductVariantReader {
  getVariantName(productVariantId: string, tenantId: string): Promise<{ sku: string; productName: string; variantName: string | null }>;
}

export interface CustomerReader {
  exists(customerId: string, tenantId: string): Promise<boolean>;
  isActive(customerId: string, tenantId: string): Promise<boolean>;
  getEmail(customerId: string, tenantId: string): Promise<string | null>;
}

export interface ShippingMethodReader {
  isValid(code: string, tenantId: string): Promise<boolean>;
  getAmount(code: string, tenantId: string): Promise<number>;
}

export interface PaymentMethodReader {
  isValid(code: string, tenantId: string): Promise<boolean>;
}

export interface OrderNumberGenerator {
  generate(tenantId: string): Promise<string>;
}

export interface Clock {
  now(): Date;
}
