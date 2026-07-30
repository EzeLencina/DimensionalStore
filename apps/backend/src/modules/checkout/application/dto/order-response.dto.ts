export type OrderItemResponseDto = {
  id: string; productVariantId: string; sku: string;
  productName: string; variantName: string | null;
  quantity: number; unitPrice: number; subtotal: number;
};

export type OrderResponseDto = {
  id: string; orderNumber: string; tenantId: string; status: string; currency: string;
  subtotal: number; shippingAmount: number; discountAmount: number; taxAmount: number; total: number;
  shippingMethodCode: string | null; paymentMethodCode: string | null;
  createdAt: string; updatedAt: string; version: number;
  items: OrderItemResponseDto[];
};
