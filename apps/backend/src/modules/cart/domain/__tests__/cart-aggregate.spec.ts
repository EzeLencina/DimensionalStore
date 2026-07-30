import { Cart, CartItem, Quantity, CartStatus, GuestCartToken, CustomerId } from '../../domain';
import { CartException, CART_ERROR_CODES } from '../../domain/exceptions';

describe('Cart Aggregate', () => {
  const now = new Date();
  const future = new Date(now.getTime() + 72 * 60 * 60 * 1000);
  const past = new Date(now.getTime() - 1000);
  const tenantId = 'tenant-1';
  const customerId = 'customer-1';
  const pv1 = 'variant-1';
  const pv2 = 'variant-2';

  describe('createGuest', () => {
    it('should create a guest cart with a raw token', () => {
      const { cart, rawToken } = Cart.createGuest({ tenantId, expiresAt: future });
      expect(cart.getId().toString()).toBeDefined();
      expect(cart.getTenantId()).toBe(tenantId);
      expect(cart.isGuest()).toBe(true);
      expect(cart.getStatus().getValue()).toBe('ACTIVE');
      expect(cart.getVersion()).toBe(1);
      expect(rawToken).toBeDefined();
      expect(rawToken.length).toBeGreaterThan(0);
      expect(cart.getGuestTokenHash()).toBeDefined();
      expect(cart.getGuestTokenHash()!.length).toBe(64);
    });

    it('should default currency to ARS', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      expect(cart.getCurrency()).toBe('ARS');
    });
  });

  describe('createCustomer', () => {
    it('should create a customer cart', () => {
      const cart = Cart.createCustomer({ tenantId, customerId, expiresAt: future });
      expect(cart.isOwnedByCustomer(customerId)).toBe(true);
      expect(cart.isGuest()).toBe(false);
      expect(cart.getCustomerId()).toBe(customerId);
    });
  });

  describe('addItem', () => {
    it('should add an item to cart', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.addItem(pv1, 'SKU-001', Quantity.create(2), 10000, now);
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getTotals().itemsCount).toBe(1);
      expect(cart.getTotals().subtotal).toBe(20000);
    });

    it('should increment quantity for existing SKU', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.addItem(pv1, 'SKU-001', Quantity.create(2), 10000, now);
      cart.addItem(pv1, 'SKU-001', Quantity.create(3), 10000, now);
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0]!.getQuantity().getValue()).toBe(5);
    });

    it('should allow different variants in same cart', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.addItem(pv1, 'SKU-001', Quantity.create(1), 10000, now);
      cart.addItem(pv2, 'SKU-002', Quantity.create(1), 20000, now);
      expect(cart.getItems()).toHaveLength(2);
    });

    it('should throw on expired cart', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: past });
      expect(() => cart.addItem(pv1, 'SKU-001', Quantity.create(1), 10000, now)).toThrow(CartException);
    });

    it('should throw on non-active cart', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.cancel(now);
      expect(() => cart.addItem(pv1, 'SKU-001', Quantity.create(1), 10000, now)).toThrow(CartException);
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.addItem(pv1, 'SKU-001', Quantity.create(2), 10000, now);
      cart.updateItemQuantity(pv1, Quantity.create(5), 10000, now);
      expect(cart.getItems()[0]!.getQuantity().getValue()).toBe(5);
    });

    it('should throw on non-existent item', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      expect(() => cart.updateItemQuantity('nonexistent', Quantity.create(1), 10000, now)).toThrow(CartException);
    });
  });

  describe('removeItem', () => {
    it('should remove an item', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.addItem(pv1, 'SKU-001', Quantity.create(1), 10000, now);
      cart.removeItem(pv1, now);
      expect(cart.getItems()).toHaveLength(0);
    });

    it('should throw on non-existent item', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      expect(() => cart.removeItem('nonexistent', now)).toThrow(CartException);
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.addItem(pv1, 'SKU-001', Quantity.create(1), 10000, now);
      cart.addItem(pv2, 'SKU-002', Quantity.create(1), 20000, now);
      cart.clear(now);
      expect(cart.getItems()).toHaveLength(0);
    });
  });

  describe('totals', () => {
    it('should calculate subtotal correctly', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.addItem(pv1, 'SKU-001', Quantity.create(2), 10000, now);
      cart.addItem(pv2, 'SKU-002', Quantity.create(3), 15000, now);
      const totals = cart.getTotals();
      expect(totals.subtotal).toBe(65000);
      expect(totals.total).toBe(65000);
    });
  });

  describe('status transitions', () => {
    it('should cancel active cart', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.cancel(now);
      expect(cart.getStatus().getValue()).toBe('CANCELLED');
    });

    it('should throw on cancel non-active cart', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.cancel(now);
      expect(() => cart.cancel(now)).toThrow(CartException);
    });

    it('should mark converted', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.markConverted(now);
      expect(cart.getStatus().getValue()).toBe('CONVERTED');
    });

    it('should mark abandoned', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.markAbandoned(now);
      expect(cart.getStatus().getValue()).toBe('ABANDONED');
    });

    it('should mark expired', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.markExpired(now);
      expect(cart.getStatus().getValue()).toBe('EXPIRED');
    });
  });

  describe('assignToCustomer', () => {
    it('should assign guest cart to customer', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.assignToCustomer(customerId, now);
      expect(cart.isOwnedByCustomer(customerId)).toBe(true);
      expect(cart.isGuest()).toBe(false);
      expect(cart.getGuestTokenHash()).toBeNull();
    });
  });

  describe('mergeFrom', () => {
    it('should merge items from another cart', () => {
      const { cart: target } = Cart.createGuest({ tenantId, expiresAt: future });
      const { cart: source } = Cart.createGuest({ tenantId, expiresAt: future });

      target.addItem(pv1, 'SKU-001', Quantity.create(1), 10000, now);
      source.addItem(pv2, 'SKU-002', Quantity.create(2), 20000, now);

      const priceMap = new Map([[pv1, 10000], [pv2, 20000]]);
      target.mergeFrom(source, priceMap, now);

      expect(target.getItems()).toHaveLength(2);
    });

    it('should sum quantities for overlapping SKUs', () => {
      const { cart: target } = Cart.createGuest({ tenantId, expiresAt: future });
      const { cart: source } = Cart.createGuest({ tenantId, expiresAt: future });

      target.addItem(pv1, 'SKU-001', Quantity.create(1), 10000, now);
      source.addItem(pv1, 'SKU-001', Quantity.create(3), 10000, now);

      const priceMap = new Map([[pv1, 10000]]);
      target.mergeFrom(source, priceMap, now);

      expect(target.getItems()).toHaveLength(1);
      expect(target.getItems()[0]!.getQuantity().getValue()).toBe(4);
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const { cart } = Cart.createGuest({ tenantId, expiresAt: future });
      cart.addItem(pv1, 'SKU-001', Quantity.create(2), 10000, now);
      const primitives = cart.toPrimitives();
      const restored = Cart.fromPrimitives(primitives);
      expect(restored.getId().toString()).toBe(cart.getId().toString());
      expect(restored.getItems()).toHaveLength(1);
      expect(restored.getItems()[0]!.getSku()).toBe('SKU-001');
      expect(restored.getVersion()).toBe(cart.getVersion());
    });
  });
});
