jest.mock('@tienda/logger/nest', () => ({ LOGGER_TOKEN: 'ILogger' }));

import { CheckoutAppService } from '../checkout-app.service';
import { InMemoryCheckoutSessionRepository } from '../../infrastructure/persistence/in-memory/in-memory-checkout-session.repository';
import { InMemoryOrderRepository } from '../../infrastructure/persistence/in-memory/in-memory-order.repository';
import { InMemoryIdempotencyRepository } from '../../infrastructure/persistence/in-memory/in-memory-idempotency.repository';
import { CheckoutException, CHECKOUT_ERROR_CODES } from '../../domain/exceptions';
import type { CartReader, PricingResolver, InventoryReservationService, ProductVariantReader, CustomerReader, ShippingMethodReader, PaymentMethodReader, OrderNumberGenerator, Clock } from '../../domain/ports';
import { StartCheckoutCommand, UpdateAddressCommand, SelectShippingMethodCommand, SelectPaymentMethodCommand, ConfirmCheckoutCommand } from '../../application/commands';

class MockClock implements Clock {
  now() { return new Date(); }
}

class MockCartReader implements CartReader {
  private cart: any = null;
  setCart(c: any) { this.cart = c; }
  async getCart(_id: string, _t: string) { return this.cart; }
}

class MockPricingResolver implements PricingResolver {
  private amount = 10000;
  private fail = false;
  setAmount(a: number) { this.amount = a; }
  setFail(f: boolean) { this.fail = f; }
  async resolveEffectivePrice(_id: string, _t: string) {
    if (this.fail) throw new Error('Price error');
    return { amount: this.amount, currency: 'ARS' };
  }
}

class MockInventoryService implements InventoryReservationService {
  async reserve() {}
  async releaseReservation() {}
}

class MockVariantReader implements ProductVariantReader {
  async getVariantName(_id: string, _t: string) {
    return { sku: 'SKU-001', productName: 'Test Product', variantName: null };
  }
}

class MockCustomerReader implements CustomerReader {
  async exists() { return true; }
  async isActive() { return true; }
  async getEmail() { return 'test@test.com'; }
}

class MockShippingReader implements ShippingMethodReader {
  private valid = true;
  setValid(v: boolean) { this.valid = v; }
  async isValid() { return this.valid; }
  async getAmount() { return 5000; }
}

class MockPaymentReader implements PaymentMethodReader {
  private valid = true;
  setValid(v: boolean) { this.valid = v; }
  async isValid() { return this.valid; }
}

class MockOrderNumberGen implements OrderNumberGenerator {
  private counter = 0;
  async generate() { return `ORD-2026-${String(++this.counter).padStart(6, '0')}`; }
}

describe('CheckoutAppService', () => {
  let service: CheckoutAppService;
  let csRepo: InMemoryCheckoutSessionRepository;
  let orderRepo: InMemoryOrderRepository;
  let idemRepo: InMemoryIdempotencyRepository;
  let cartReader: MockCartReader;
  let pricingResolver: MockPricingResolver;
  let inventoryService: MockInventoryService;
  let variantReader: MockVariantReader;
  let customerReader: MockCustomerReader;
  let shippingReader: MockShippingReader;
  let paymentReader: MockPaymentReader;
  let orderNumberGen: MockOrderNumberGen;
  let clock: MockClock;

  const tenantId = 'tenant-1';
  const cartId = 'cart-1';
  const pv1 = 'variant-1';

  const activeCart = {
    id: cartId, tenantId, customerId: 'customer-1', guestTokenHash: null,
    status: 'ACTIVE', currency: 'ARS', version: 1,
    items: [{ id: 'ci-1', productVariantId: pv1, sku: 'SKU-001', quantity: 2, unitPriceSnapshot: 10000 }],
  };

  beforeEach(() => {
    csRepo = new InMemoryCheckoutSessionRepository();
    orderRepo = new InMemoryOrderRepository();
    idemRepo = new InMemoryIdempotencyRepository();
    cartReader = new MockCartReader();
    pricingResolver = new MockPricingResolver();
    inventoryService = new MockInventoryService();
    variantReader = new MockVariantReader();
    customerReader = new MockCustomerReader();
    shippingReader = new MockShippingReader();
    paymentReader = new MockPaymentReader();
    orderNumberGen = new MockOrderNumberGen();
    clock = new MockClock();
    const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };

    cartReader.setCart(activeCart);

    service = new CheckoutAppService(
      csRepo as any, orderRepo as any, idemRepo as any,
      cartReader as any, pricingResolver as any, inventoryService as any,
      variantReader as any, customerReader as any,
      shippingReader as any, paymentReader as any,
      orderNumberGen as any, clock as any, logger as any,
    );
  });

  describe('startCheckout', () => {
    it('should start checkout', async () => {
      const result = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      expect(result.id).toBeDefined();
      expect(result.status).toBe('OPEN');
      expect(result.subtotal).toBe(20000);
    });

    it('should throw on empty cart', async () => {
      cartReader.setCart({ ...activeCart, items: [] });
      await expect(service.startCheckout(new StartCheckoutCommand(tenantId, cartId))).rejects.toThrow(CheckoutException);
    });

    it('should throw on non-active cart', async () => {
      cartReader.setCart({ ...activeCart, status: 'CONVERTED' });
      await expect(service.startCheckout(new StartCheckoutCommand(tenantId, cartId))).rejects.toThrow(CheckoutException);
    });
  });

  describe('updateAddress', () => {
    it('should update address', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      const cmd = new UpdateAddressCommand('John', null, 'Street', '123', null, 'City', 'Prov', '1000', 'AR', null);
      const result = await service.updateAddress(id, tenantId, cmd);
      expect(result.address).toBeDefined();
      expect(result.address!.recipientName).toBe('John');
    });
  });

  describe('selectShippingMethod', () => {
    it('should select shipping', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      const result = await service.selectShippingMethod(id, tenantId, new SelectShippingMethodCommand('STANDARD'));
      expect(result.shippingMethodCode).toBe('STANDARD');
    });

    it('should throw on invalid shipping', async () => {
      shippingReader.setValid(false);
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      await expect(service.selectShippingMethod(id, tenantId, new SelectShippingMethodCommand('INVALID'))).rejects.toThrow(CheckoutException);
    });
  });

  describe('selectPaymentMethod', () => {
    it('should select payment', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      const result = await service.selectPaymentMethod(id, tenantId, new SelectPaymentMethodCommand('MP'));
      expect(result.paymentMethodCode).toBe('MP');
    });

    it('should throw on invalid payment', async () => {
      paymentReader.setValid(false);
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      await expect(service.selectPaymentMethod(id, tenantId, new SelectPaymentMethodCommand('INVALID'))).rejects.toThrow(CheckoutException);
    });
  });

  describe('validateCheckout', () => {
    it('should validate', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      await service.updateAddress(id, tenantId, new UpdateAddressCommand('John', null, 'St', '1', null, 'City', 'Prov', '1000', 'AR', null));
      await service.selectShippingMethod(id, tenantId, new SelectShippingMethodCommand('STANDARD'));
      await service.selectPaymentMethod(id, tenantId, new SelectPaymentMethodCommand('MP'));
      const result = await service.validateCheckout(id, tenantId);
      expect(result.status).toBe('VALIDATING');
    });

    it('should throw on missing address', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      await expect(service.validateCheckout(id, tenantId)).rejects.toThrow(CheckoutException);
    });
  });

  describe('confirmCheckout', () => {
    it('should confirm, create order, and set cart converted', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      await service.updateAddress(id, tenantId, new UpdateAddressCommand('John', null, 'St', '1', null, 'City', 'Prov', '1000', 'AR', null));
      await service.selectShippingMethod(id, tenantId, new SelectShippingMethodCommand('STANDARD'));
      await service.selectPaymentMethod(id, tenantId, new SelectPaymentMethodCommand('MP'));

      const order = await service.confirmCheckout(id, tenantId, new ConfirmCheckoutCommand(tenantId, 'idem-1'));
      expect(order.orderNumber).toBe('ORD-2026-000001');
      expect(order.status).toBe('PENDING_PAYMENT');
      expect(order.items).toHaveLength(1);
      expect(order.items[0].quantity).toBe(2);
    });

    it('should be idempotent', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      await service.updateAddress(id, tenantId, new UpdateAddressCommand('John', null, 'St', '1', null, 'City', 'Prov', '1000', 'AR', null));
      await service.selectShippingMethod(id, tenantId, new SelectShippingMethodCommand('STANDARD'));
      await service.selectPaymentMethod(id, tenantId, new SelectPaymentMethodCommand('MP'));

      const first = await service.confirmCheckout(id, tenantId, new ConfirmCheckoutCommand(tenantId, 'idem-1'));
      const second = await service.confirmCheckout(id, tenantId, new ConfirmCheckoutCommand(tenantId, 'idem-1'));
      expect(second.orderNumber).toBe(first.orderNumber);
    });

    it('should throw on missing idempotency key', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      await expect(service.confirmCheckout(id, tenantId, new ConfirmCheckoutCommand(tenantId, ''))).rejects.toThrow(CheckoutException);
    });

    it('should throw on price change', async () => {
      pricingResolver.setAmount(15000);
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      await service.updateAddress(id, tenantId, new UpdateAddressCommand('John', null, 'St', '1', null, 'City', 'Prov', '1000', 'AR', null));
      await service.selectShippingMethod(id, tenantId, new SelectShippingMethodCommand('STANDARD'));
      await service.selectPaymentMethod(id, tenantId, new SelectPaymentMethodCommand('MP'));
      await expect(service.confirmCheckout(id, tenantId, new ConfirmCheckoutCommand(tenantId, 'idem-1'))).rejects.toThrow(CheckoutException);
    });
  });

  describe('cancelCheckout', () => {
    it('should cancel checkout', async () => {
      const { id } = await service.startCheckout(new StartCheckoutCommand(tenantId, cartId));
      const result = await service.cancelCheckout(id, tenantId);
      expect(result.status).toBe('CANCELLED');
    });
  });
});
