export type AddressResponseDto = {
  recipientName: string; phone: string | null;
  street: string; number: string; apartment: string | null;
  city: string; province: string; postalCode: string; country: string; notes: string | null;
};

export type CheckoutSessionResponseDto = {
  id: string; tenantId: string; cartId: string; status: string; currency: string;
  subtotal: number; shippingAmount: number; discountAmount: number; taxAmount: number; total: number;
  shippingMethodCode: string | null; paymentMethodCode: string | null;
  expiresAt: string; version: number;
  createdAt: string; updatedAt: string;
  address: AddressResponseDto | null;
};
