import { CheckoutSession, Address } from '../../domain';
import { CheckoutException, CHECKOUT_ERROR_CODES } from '../../domain/exceptions';

describe('CheckoutSession Aggregate', () => {
  const now = new Date();
  const future = new Date(now.getTime() + 30 * 60 * 1000);
  const tenantId = 'tenant-1';
  const cartId = 'cart-1';
  const validAddress = Address.create({
    recipientName: 'John Doe', phone: null, street: 'Av. Corrientes', number: '1234',
    apartment: null, city: 'CABA', province: 'CABA', postalCode: '1000', country: 'AR', notes: null,
  });

  describe('start', () => {
    it('should start a checkout session', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      expect(cs.getId().toString()).toBeDefined();
      expect(cs.getStatus().getValue()).toBe('OPEN');
      expect(cs.getSubtotal()).toBe(50000);
      expect(cs.getTotal()).toBe(50000);
      expect(cs.isModifiable()).toBe(true);
    });
  });

  describe('setAddress', () => {
    it('should set address', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      cs.setAddress(validAddress);
      expect(cs.getAddress()).toBeDefined();
      expect(cs.getAddress()!.toPrimitives().recipientName).toBe('John Doe');
    });
  });

  describe('select shipping/payment', () => {
    it('should select shipping method', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      cs.selectShippingMethod('STANDARD');
      expect(cs.getShippingMethodCode()).toBe('STANDARD');
    });

    it('should select payment method', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      cs.selectPaymentMethod('MERCADO_PAGO');
      expect(cs.getPaymentMethodCode()).toBe('MERCADO_PAGO');
    });
  });

  describe('setTotals', () => {
    it('should calculate totals', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      cs.setTotals(5000, 2000, 1000);
      expect(cs.getShippingAmount()).toBe(5000);
      expect(cs.getDiscountAmount()).toBe(2000);
      expect(cs.getTaxAmount()).toBe(1000);
      expect(cs.getTotal()).toBe(54000); // 50000 + 5000 + 1000 - 2000
    });

    it('should clamp negative total to 0', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 100, expiresAt: future });
      cs.setTotals(0, 500, 0);
      expect(cs.getTotal()).toBe(0);
    });
  });

  describe('status transitions', () => {
    it('should transition VALIDATING -> READY -> COMPLETED', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      cs.setAddress(validAddress);
      cs.selectShippingMethod('STANDARD');
      cs.selectPaymentMethod('MP');
      cs.setTotals(5000, 0, 0);

      cs.setStatus('VALIDATING', now);
      expect(cs.getStatus().getValue()).toBe('VALIDATING');

      cs.setStatus('READY', now);
      expect(cs.getStatus().getValue()).toBe('READY');

      cs.setStatus('COMPLETED', now);
      expect(cs.getStatus().getValue()).toBe('COMPLETED');
    });

    it('should throw on invalid transition', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      expect(() => cs.setStatus('COMPLETED', now)).toThrow(CheckoutException);
    });

    it('should cancel', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      cs.setStatus('CANCELLED', now);
      expect(cs.getStatus().getValue()).toBe('CANCELLED');
    });
  });

  describe('isExpired', () => {
    it('should be expired after expiresAt', () => {
      const past = new Date(now.getTime() - 1000);
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: past });
      expect(cs.isExpired(now)).toBe(true);
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const cs = CheckoutSession.start({ tenantId, cartId, subtotal: 50000, expiresAt: future });
      cs.setAddress(validAddress);
      cs.selectShippingMethod('STANDARD');
      cs.setTotals(5000, 0, 1000);

      const primitives = cs.toPrimitives();
      const restored = CheckoutSession.fromPrimitives(primitives);

      expect(restored.getId().toString()).toBe(cs.getId().toString());
      expect(restored.getStatus().getValue()).toBe('OPEN');
      expect(restored.getAddress()).toBeDefined();
      expect(restored.getTotal()).toBe(56000);
    });
  });
});
