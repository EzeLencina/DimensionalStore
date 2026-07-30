import type { CheckoutSession } from '../../domain';
import type { CheckoutSessionResponseDto, AddressResponseDto, OrderResponseDto, OrderItemResponseDto } from '../dto';
import type { Order } from '../../domain';

export class CheckoutMapper {
  static toResponse(cs: CheckoutSession): CheckoutSessionResponseDto {
    const p = cs.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, cartId: p.cartId, status: p.status, currency: p.currency,
      subtotal: p.subtotal, shippingAmount: p.shippingAmount,
      discountAmount: p.discountAmount, taxAmount: p.taxAmount, total: p.total,
      shippingMethodCode: p.shippingMethodCode, paymentMethodCode: p.paymentMethodCode,
      expiresAt: p.expiresAt.toISOString(), version: p.version,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
      address: p.address ? {
        recipientName: p.address.recipientName, phone: p.address.phone,
        street: p.address.street, number: p.address.number, apartment: p.address.apartment,
        city: p.address.city, province: p.address.province,
        postalCode: p.address.postalCode, country: p.address.country, notes: p.address.notes,
      } : null,
    };
  }

  static orderToResponse(order: Order): OrderResponseDto {
    const p = order.toPrimitives();
    return {
      id: p.id, orderNumber: p.orderNumber, tenantId: p.tenantId,
      status: p.status, currency: p.currency,
      subtotal: p.subtotal, shippingAmount: p.shippingAmount,
      discountAmount: p.discountAmount, taxAmount: p.taxAmount, total: p.total,
      shippingMethodCode: p.shippingMethodCode, paymentMethodCode: p.paymentMethodCode,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(), version: p.version,
      items: p.items.map(i => ({
        id: i.id, productVariantId: i.productVariantId, sku: i.sku,
        productName: i.productNameSnapshot, variantName: i.variantNameSnapshot,
        quantity: i.quantity, unitPrice: i.unitPrice, subtotal: i.subtotal,
      })),
    };
  }
}
