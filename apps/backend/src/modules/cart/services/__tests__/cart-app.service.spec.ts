jest.mock('@tienda/logger/nest', () => ({ LOGGER_TOKEN: 'ILogger' }));

import { CartAppService } from '../cart-app.service';
import { InMemoryCartRepository } from '../../infrastructure/persistence/in-memory/in-memory-cart.repository';
import { CartException, CART_ERROR_CODES } from '../../domain/exceptions';
import { Quantity, Cart, type Clock, type ProductVariantReader, type PricingResolver, type InventoryAvailabilityReader } from '../../domain';
import { CreateGuestCartCommand, GetOrCreateCustomerCartCommand, AddCartItemCommand, UpdateCartItemQuantityCommand, RemoveCartItemCommand, MergeCartCommand } from '../../application/commands';

class MockClock implements Clock {
  private fixed: Date;
  constructor() { this.fixed = new Date(); }
  setDate(d: Date) { this.fixed = d; }
  now(): Date { return this.fixed; }
}

class MockVariantReader implements ProductVariantReader {
  private active = true;
  private sku = 'SKU-001';
  setActive(v: boolean) { this.active = v; }
  setSku(s: string) { this.sku = s; }
  async isActive(_id: string, _tenant: string) { return this.active; }
  async getSku(_id: string, _tenant: string) { return this.sku; }
}

class MockPricingResolver implements PricingResolver {
  private amount = 10000;
  private fail = false;
  setAmount(a: number) { this.amount = a; }
  setFail(f: boolean) { this.fail = f; }
  async resolveEffectivePrice(_id: string, _tenant: string) {
    if (this.fail) throw new Error('Price error');
    return { amount: this.amount, currency: 'ARS' };
  }
}

class MockInventoryReader implements InventoryAvailabilityReader {
  private stock = 100;
  setStock(s: number) { this.stock = s; }
  async getAvailableStock(_id: string, _tenant: string) { return this.stock; }
}

describe('CartAppService', () => {
  let service: CartAppService;
  let repository: InMemoryCartRepository;
  let clock: MockClock;
  let variantReader: MockVariantReader;
  let pricingResolver: MockPricingResolver;
  let inventoryReader: MockInventoryReader;
  const tenantId = 'tenant-1';
  const customerId = 'customer-1';
  const pv1 = 'variant-1';

  beforeEach(() => {
    repository = new InMemoryCartRepository();
    clock = new MockClock();
    variantReader = new MockVariantReader();
    pricingResolver = new MockPricingResolver();
    inventoryReader = new MockInventoryReader();
    const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
    service = new CartAppService(
      repository as any, variantReader as any, pricingResolver as any,
      inventoryReader as any, clock as any, logger as any,
    );
  });

  describe('createGuestCart', () => {
    it('should create a guest cart', async () => {
      const result = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      expect(result.cart.id).toBeDefined();
      expect(result.cart.isGuest).toBe(true);
      expect(result.cart.status).toBe('ACTIVE');
      expect(result.guestToken).toBeDefined();
    });
  });

  describe('getOrCreateCustomerCart', () => {
    it('should create a new customer cart when none exists', async () => {
      const result = await service.getOrCreateCustomerCart(new GetOrCreateCustomerCartCommand(tenantId, customerId));
      expect(result.id).toBeDefined();
      expect(result.isGuest).toBe(false);
    });

    it('should return existing active cart', async () => {
      const first = await service.getOrCreateCustomerCart(new GetOrCreateCustomerCartCommand(tenantId, customerId));
      const second = await service.getOrCreateCustomerCart(new GetOrCreateCustomerCartCommand(tenantId, customerId));
      expect(second.id).toBe(first.id);
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      const result = await service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 2));
      expect(result.items).toHaveLength(1);
      expect(result.items[0].sku).toBe('SKU-001');
      expect(result.items[0].quantity).toBe(2);
    });

    it('should throw on invalid quantity', async () => {
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await expect(service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 0))).rejects.toThrow(CartException);
    });

    it('should throw on insufficient stock', async () => {
      inventoryReader.setStock(0);
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await expect(service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 1))).rejects.toThrow(CartException);
    });

    it('should throw on inactive variant', async () => {
      variantReader.setActive(false);
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await expect(service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 1))).rejects.toThrow(CartException);
    });

    it('should throw on price failure', async () => {
      pricingResolver.setFail(true);
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await expect(service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 1))).rejects.toThrow(CartException);
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity', async () => {
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 2));
      const result = await service.updateItemQuantity(cart.id, tenantId, new UpdateCartItemQuantityCommand(tenantId, pv1, 5));
      expect(result.items[0].quantity).toBe(5);
    });
  });

  describe('removeItem', () => {
    it('should remove item', async () => {
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 2));
      const result = await service.removeItem(cart.id, tenantId, new RemoveCartItemCommand(tenantId, pv1));
      expect(result.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items', async () => {
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 2));
      const result = await service.clearCart(cart.id, tenantId);
      expect(result.items).toHaveLength(0);
    });
  });

  describe('recalculateCart', () => {
    it('should recalculate prices', async () => {
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await service.addItem(cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 2));
      pricingResolver.setAmount(12000);
      const result = await service.recalculateCart(cart.id, tenantId);
      expect(result.items[0].unitPriceSnapshot).toBe(12000);
    });
  });

  describe('cancelCart', () => {
    it('should cancel cart', async () => {
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      const result = await service.cancelCart(cart.id, tenantId);
      expect(result.status).toBe('CANCELLED');
    });
  });

  describe('mergeCart', () => {
    it('should merge guest cart into customer cart', async () => {
      const guest = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await service.addItem(guest.cart.id, tenantId, new AddCartItemCommand(tenantId, pv1, 2));

      const existingCart = await repository.findActiveByGuestTokenHash(guest.cart.id, tenantId);
      const actualHash = CartAppService.hashToken(guest.guestToken);

      const result = await service.mergeCart(tenantId, customerId, new MergeCartCommand(tenantId, actualHash));
      expect(result.items).toHaveLength(1);
    });
  });

  describe('resolveCurrentCart', () => {
    it('should resolve customer cart', async () => {
      await service.getOrCreateCustomerCart(new GetOrCreateCustomerCartCommand(tenantId, customerId));
      const result = await service.resolveCurrentCart({ tenantId, customerId });
      expect(result).not.toBeNull();
    });

    it('should return null for no cart', async () => {
      const result = await service.resolveCurrentCart({ tenantId, customerId: 'nonexistent' });
      expect(result).toBeNull();
    });
  });

  describe('security', () => {
    it('should throw on cross-tenant access', async () => {
      const { cart } = await service.createGuestCart(new CreateGuestCartCommand(tenantId));
      await expect(service.getCart(cart.id, 'other-tenant')).rejects.toThrow(CartException);
    });
  });
});
