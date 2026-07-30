import { CheckoutSession, type CheckoutSessionPrimitives } from '../../../../domain';

export class PrismaCheckoutMapper {
  static toDomain(model: any): CheckoutSession {
    return CheckoutSession.fromPrimitives({
      id: model.id, tenantId: model.tenantId, cartId: model.cartId,
      customerId: model.customerId, guestEmail: model.guestEmail,
      status: model.status, currency: model.currency,
      subtotal: model.subtotal, shippingAmount: model.shippingAmount,
      discountAmount: model.discountAmount, taxAmount: model.taxAmount, total: model.total,
      shippingMethodCode: model.shippingMethodCode, paymentMethodCode: model.paymentMethodCode,
      expiresAt: model.expiresAt, idempotencyKey: model.idempotencyKey, version: model.version,
      createdAt: model.createdAt, updatedAt: model.updatedAt,
      address: model.address ? {
        recipientName: model.address.recipientName, phone: model.address.phone,
        street: model.address.street, number: model.address.number,
        apartment: model.address.apartment,
        city: model.address.city, province: model.address.province,
        postalCode: model.address.postalCode, country: model.address.country,
        notes: model.address.notes,
      } : null,
    } as CheckoutSessionPrimitives);
  }

  static toCreateInput(cs: CheckoutSession): any {
    const p = cs.toPrimitives();
    const data: any = {
      id: p.id, tenantId: p.tenantId, cartId: p.cartId,
      customerId: p.customerId, guestEmail: p.guestEmail,
      status: p.status, currency: p.currency,
      subtotal: p.subtotal, shippingAmount: p.shippingAmount,
      discountAmount: p.discountAmount, taxAmount: p.taxAmount, total: p.total,
      shippingMethodCode: p.shippingMethodCode, paymentMethodCode: p.paymentMethodCode,
      expiresAt: p.expiresAt, idempotencyKey: p.idempotencyKey,
      createdAt: p.createdAt, updatedAt: p.updatedAt,
    };
    if (p.address) {
      data.address = { create: { ...p.address } };
    }
    return data;
  }
}
