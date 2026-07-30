import { Order } from '../../domain';

describe('Order Aggregate', () => {
  const tenantId = 'tenant-1';
  const params = {
    tenantId, orderNumber: 'ORD-2026-000001', cartId: 'cart-1',
    checkoutSessionId: 'cs-1', customerId: 'customer-1',
    currency: 'ARS', subtotal: 50000, shippingAmount: 5000,
    discountAmount: 2000, taxAmount: 1000, total: 54000,
    shippingMethodCode: 'STANDARD', paymentMethodCode: 'MERCADO_PAGO',
    items: [
      { productVariantId: 'pv-1', sku: 'SKU-001', productName: 'Product 1', variantName: null, quantity: 2, unitPrice: 10000 },
      { productVariantId: 'pv-2', sku: 'SKU-002', productName: 'Product 2', variantName: 'Large', quantity: 1, unitPrice: 30000 },
    ],
  };

  describe('create', () => {
    it('should create an order', () => {
      const order = Order.create(params);
      expect(order.getId().toString()).toBeDefined();
      expect(order.getOrderNumber()).toBe('ORD-2026-000001');
      expect(order.getStatus().getValue()).toBe('PENDING_PAYMENT');
      expect(order.getTotal()).toBe(54000);
      expect(order.getItems()).toHaveLength(2);
    });

    it('should calculate item subtotals', () => {
      const order = Order.create(params);
      const items = order.getItems();
      expect(items[0]!.subtotal).toBe(20000); // 2 * 10000
      expect(items[1]!.subtotal).toBe(30000); // 1 * 30000
    });
  });

  describe('cancel', () => {
    it('should cancel an order', () => {
      const order = Order.create(params);
      order.cancel(new Date());
      expect(order.getStatus().getValue()).toBe('CANCELLED');
    });

    it('should throw on cancelled order', () => {
      const order = Order.create(params);
      order.cancel(new Date());
      expect(() => order.cancel(new Date())).toThrow();
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const order = Order.create(params);
      const primitives = order.toPrimitives();
      const restored = Order.fromPrimitives(primitives);
      expect(restored.getOrderNumber()).toBe(order.getOrderNumber());
      expect(restored.getItems()).toHaveLength(2);
      expect(restored.getTotal()).toBe(54000);
    });
  });
});
