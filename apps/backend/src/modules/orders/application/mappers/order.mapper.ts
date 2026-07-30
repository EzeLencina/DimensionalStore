import type { Order } from '../../../checkout/domain';
import type { OrderStatusHistory } from '../../domain';
import type { OrderNote } from '../../domain';
import type { OrderResponseDto, OrderStatusHistoryResponseDto, OrderNoteResponseDto } from '../dto';

export class OrderMapper {
  static toResponse(order: Order, history?: OrderStatusHistory[], notes?: OrderNote[]): OrderResponseDto {
    const p = order.toPrimitives();
    return {
      id: p.id, orderNumber: p.orderNumber, tenantId: p.tenantId,
      status: p.status, currency: p.currency,
      subtotal: p.subtotal, shippingAmount: p.shippingAmount,
      discountAmount: p.discountAmount, taxAmount: p.taxAmount, total: p.total,
      shippingMethodCode: p.shippingMethodCode, paymentMethodCode: p.paymentMethodCode,
      paymentStatus: p.paymentStatus, fulfillmentStatus: p.fulfillmentStatus,
      cancellationReason: p.cancellationReason,
      cancelledAt: p.cancelledAt?.toISOString() ?? null,
      confirmedAt: p.confirmedAt?.toISOString() ?? null,
      processingStartedAt: p.processingStartedAt?.toISOString() ?? null,
      readyAt: p.readyAt?.toISOString() ?? null,
      shippedAt: p.shippedAt?.toISOString() ?? null,
      deliveredAt: p.deliveredAt?.toISOString() ?? null,
      expiredAt: p.expiredAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(), version: p.version,
      items: p.items.map(i => ({
        id: i.id, productVariantId: i.productVariantId, sku: i.sku,
        productName: i.productNameSnapshot, variantName: i.variantNameSnapshot,
        quantity: i.quantity, unitPrice: i.unitPrice, subtotal: i.subtotal,
      })),
      history: history?.map(h => OrderMapper.historyToResponse(h)),
      notes: notes?.map(n => OrderMapper.noteToResponse(n)),
      trackingCarrier: p.carrierCode, trackingNumber: p.trackingNumber, trackingUrl: p.trackingUrl,
    };
  }

  static historyToResponse(h: OrderStatusHistory): OrderStatusHistoryResponseDto {
    return {
      id: h.getId(),
      fromStatus: h.getFromStatus(),
      toStatus: h.getToStatus(),
      reason: h.toPrimitives().reason,
      changedByType: h.toPrimitives().changedByType,
      createdAt: h.getCreatedAt().toISOString(),
    };
  }

  static noteToResponse(n: OrderNote): OrderNoteResponseDto {
    const p = n.toPrimitives();
    return {
      id: p.id, content: p.content, visibility: p.visibility,
      createdBy: p.createdBy,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      deletedAt: p.deletedAt?.toISOString() ?? null,
    };
  }
}
