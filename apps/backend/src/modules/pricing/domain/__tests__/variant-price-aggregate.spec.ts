import { VariantPrice } from '../aggregates/variant-price.aggregate';
import { PricingException, PRICING_ERROR_CODES } from '../exceptions';

describe('VariantPrice Aggregate', () => {
  const validProps = {
    tenantId: 'tenant-1', priceListId: 'pl-1',
    productVariantId: 'pv-1', sku: 'SKU-001', listAmount: 10000,
  };

  describe('create', () => {
    it('should create with list amount', () => {
      const vp = VariantPrice.create(validProps);
      expect(vp.getId().toString()).toBeDefined();
      expect(vp.getListAmount().toCents()).toBe(10000);
      expect(vp.getVersion()).toBe(1);
      expect(vp.getMinimumQuantity()).toBe(1);
    });

    it('should accept optional fields', () => {
      const vp = VariantPrice.create({ ...validProps, costAmount: 5000, saleAmount: 8000, minimumQuantity: 5 });
      expect(vp.getSaleAmount()!.toCents()).toBe(8000);
      expect(vp.getMinimumQuantity()).toBe(5);
    });
  });

  describe('updatePricing', () => {
    it('should update pricing', () => {
      const vp = VariantPrice.create(validProps);
      vp.updatePricing(6000, 12000, 10000);
      expect(vp.getListAmount().toCents()).toBe(12000);
      expect(vp.getSaleAmount()!.toCents()).toBe(10000);
    });
  });

  describe('effective price', () => {
    it('should return list price when no sale or promotion', () => {
      const vp = VariantPrice.create(validProps);
      const now = new Date();
      expect(vp.getEffectivePrice(now).toCents()).toBe(10000);
    });

    it('should return sale price when no active promotion', () => {
      const vp = VariantPrice.create({ ...validProps, saleAmount: 8000 });
      expect(vp.getEffectivePrice(new Date()).toCents()).toBe(8000);
    });

    it('should return promotional price when active', () => {
      const vp = VariantPrice.create(validProps);
      vp.schedulePromotion(7000, new Date('2024-01-01'), new Date('2026-01-01'));
      expect(vp.getEffectivePrice(new Date('2025-01-01')).toCents()).toBe(7000);
    });

    it('should return list when promotion expired', () => {
      const vp = VariantPrice.create({ ...validProps, saleAmount: 8000 });
      vp.schedulePromotion(7000, new Date('2023-01-01'), new Date('2024-01-01'));
      expect(vp.getEffectivePrice(new Date('2025-01-01')).toCents()).toBe(8000);
    });
  });

  describe('promotion', () => {
    it('should schedule promotion', () => {
      const vp = VariantPrice.create(validProps);
      vp.schedulePromotion(7000, new Date('2024-01-01'), new Date('2024-12-31'));
      expect(vp.getPromotionalAmount()!.toCents()).toBe(7000);
      expect(vp.hasActivePromotion(new Date('2024-06-01'))).toBe(true);
    });

    it('should throw when promotional price exceeds list', () => {
      const vp = VariantPrice.create(validProps);
      expect(() => vp.schedulePromotion(15000, new Date('2024-01-01'), new Date('2024-12-31'))).toThrow(PricingException);
    });

    it('should throw on invalid date range', () => {
      const vp = VariantPrice.create(validProps);
      expect(() => vp.schedulePromotion(7000, new Date('2025-01-01'), new Date('2024-01-01'))).toThrow(PricingException);
    });

    it('should cancel promotion', () => {
      const vp = VariantPrice.create(validProps);
      vp.schedulePromotion(7000, new Date('2024-01-01'), new Date('2024-12-31'));
      vp.cancelPromotion();
      expect(vp.getPromotionalAmount()).toBeNull();
      expect(vp.hasActivePromotion(new Date('2024-06-01'))).toBe(false);
    });
  });

  describe('softDelete', () => {
    it('should soft delete', () => {
      const vp = VariantPrice.create(validProps);
      vp.softDelete();
      const p = vp.toPrimitives();
      expect(p.deletedAt).not.toBeNull();
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const vp = VariantPrice.create(validProps);
      const primitives = vp.toPrimitives();
      const restored = VariantPrice.fromPrimitives(primitives);
      expect(restored.getId().toString()).toBe(vp.getId().toString());
      expect(restored.getListAmount().toCents()).toBe(vp.getListAmount().toCents());
    });
  });
});
