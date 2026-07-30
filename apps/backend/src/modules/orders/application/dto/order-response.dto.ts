export type OrderItemResponseDto = {
  id: string; productVariantId: string; sku: string;
  productName: string; variantName: string | null;
  quantity: number; unitPrice: number; subtotal: number;
};

export type OrderStatusHistoryResponseDto = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
  changedByType?: string;
  createdAt: string;
};

export type OrderNoteResponseDto = {
  id: string;
  content: string;
  visibility: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type OrderResponseDto = {
  id: string; orderNumber: string; tenantId: string; status: string; currency: string;
  subtotal: number; shippingAmount: number; discountAmount: number; taxAmount: number; total: number;
  shippingMethodCode: string | null; paymentMethodCode: string | null;
  paymentStatus: string | null; fulfillmentStatus: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null; confirmedAt: string | null;
  processingStartedAt: string | null; readyAt: string | null;
  shippedAt: string | null; deliveredAt: string | null; expiredAt: string | null;
  createdAt: string; updatedAt: string; version: number;
  items: OrderItemResponseDto[];
  history?: OrderStatusHistoryResponseDto[];
  notes?: OrderNoteResponseDto[];
  trackingCarrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
};

export type OrderListResponseDto = {
  items: OrderResponseDto[];
  total: number;
  limit: number;
  offset: number;
};
