import { Order } from '../../checkout/domain/aggregates/order.aggregate';

function makeOrder(): Order {
  return Order.create({
    tenantId: 'tenant-1', orderNumber: 'ORD-001', cartId: 'cart-1', checkoutSessionId: 'cs-1',
    customerId: 'customer-1', currency: 'ARS',
    subtotal: 20000, shippingAmount: 5000, discountAmount: 0, taxAmount: 0, total: 25000,
    shippingMethodCode: 'STANDARD', paymentMethodCode: 'MP',
    items: [{ productVariantId: 'pv-1', sku: 'SKU-001', productName: 'Test', variantName: null, quantity: 2, unitPrice: 10000 }],
  });
}

describe('Order Aggregate', () => {
  describe('initial state', () => {
    it('should create with PENDING_PAYMENT', () => {
      const order = makeOrder();
      expect(order.getStatus().toString()).toBe('PENDING_PAYMENT');
      expect(order.getVersion()).toBe(1);
    });
  });

  describe('confirmPayment', () => {
    it('should transition to PAYMENT_CONFIRMED', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      expect(order.getStatus().toString()).toBe('PAYMENT_CONFIRMED');
    });

    it('should set confirmedAt', () => {
      const now = new Date('2026-07-30T12:00:00Z');
      const order = makeOrder();
      order.confirmPayment(now);
      expect(order.getConfirmedAt()).toEqual(now);
    });
  });

  describe('failPayment', () => {
    it('should transition to PAYMENT_FAILED', () => {
      const order = makeOrder();
      order.failPayment(new Date());
      expect(order.getStatus().toString()).toBe('PAYMENT_FAILED');
    });
  });

  describe('retryPayment', () => {
    it('should transition back to PENDING_PAYMENT', () => {
      const order = makeOrder();
      order.failPayment(new Date());
      order.retryPayment(new Date());
      expect(order.getStatus().toString()).toBe('PENDING_PAYMENT');
    });
  });

  describe('startProcessing', () => {
    it('should transition to PROCESSING', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      order.startProcessing(new Date());
      expect(order.getStatus().toString()).toBe('PROCESSING');
    });

    it('should NOT allow processing without payment', () => {
      const order = makeOrder();
      expect(() => order.startProcessing(new Date())).toThrow();
    });
  });

  describe('markReady', () => {
    it('should transition to READY_FOR_PICKUP', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      order.startProcessing(new Date());
      order.markReady(new Date());
      expect(order.getStatus().toString()).toBe('READY_FOR_PICKUP');
    });
  });

  describe('markShipped', () => {
    it('should transition to SHIPPED', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      order.startProcessing(new Date());
      order.markShipped(new Date());
      expect(order.getStatus().toString()).toBe('SHIPPED');
    });
  });

  describe('markDelivered', () => {
    it('should transition to DELIVERED', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      order.startProcessing(new Date());
      order.markShipped(new Date());
      order.markDelivered(new Date());
      expect(order.getStatus().toString()).toBe('DELIVERED');
      expect(order.getDeliveredAt()).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('should cancel from PENDING_PAYMENT', () => {
      const order = makeOrder();
      order.cancel(new Date(), 'Customer request');
      expect(order.getStatus().toString()).toBe('CANCELLED');
      expect(order.getCancellationReason()).toBe('Customer request');
    });

    it('should cancel from PAYMENT_CONFIRMED', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      order.cancel(new Date());
      expect(order.getStatus().toString()).toBe('CANCELLED');
    });

    it('should cancel from PROCESSING', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      order.startProcessing(new Date());
      order.cancel(new Date());
      expect(order.getStatus().toString()).toBe('CANCELLED');
    });

    it('should NOT cancel from DELIVERED', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      order.startProcessing(new Date());
      order.markShipped(new Date());
      order.markDelivered(new Date());
      expect(() => order.cancel(new Date())).toThrow();
    });

    it('should NOT cancel from CANCELLED', () => {
      const order = makeOrder();
      order.cancel(new Date());
      expect(() => order.cancel(new Date())).toThrow();
    });
  });

  describe('expire', () => {
    it('should transition to EXPIRED', () => {
      const order = makeOrder();
      order.expire(new Date());
      expect(order.getStatus().toString()).toBe('EXPIRED');
    });
  });

  describe('invalid transitions', () => {
    it('should NOT ship from PENDING_PAYMENT', () => {
      const order = makeOrder();
      expect(() => order.markShipped(new Date())).toThrow();
    });

    it('should NOT deliver from PENDING_PAYMENT', () => {
      const order = makeOrder();
      expect(() => order.markDelivered(new Date())).toThrow();
    });

    it('should NOT confirm payment twice', () => {
      const order = makeOrder();
      order.confirmPayment(new Date());
      expect(() => order.confirmPayment(new Date())).toThrow();
    });
  });
});
