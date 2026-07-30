import { PriceList } from '../aggregates/price-list.aggregate';
import { PricingException } from '../exceptions';

describe('PriceList Aggregate', () => {
  const validProps = { tenantId: 'tenant-1', name: 'Lista Retail', code: 'RETAIL' };

  describe('create', () => {
    it('should create a valid price list', () => {
      const pl = PriceList.create(validProps);
      expect(pl.getId().toString()).toBeDefined();
      expect(pl.getTenantId()).toBe('tenant-1');
      expect(pl.getName()).toBe('Lista Retail');
      expect(pl.getCode()).toBe('RETAIL');
      expect(pl.getCurrency()).toBe('ARS');
      expect(pl.getStatus()).toBe('ACTIVE');
      expect(pl.getVersion()).toBe(1);
      expect(pl.isActive()).toBe(true);
    });

    it('should uppercase code', () => {
      const pl = PriceList.create({ ...validProps, code: 'retail' });
      expect(pl.getCode()).toBe('RETAIL');
    });

    it('should accept optional fields', () => {
      const pl = PriceList.create({
        ...validProps, currency: 'USD', type: 'WHOLESALE', priority: 10,
        channel: 'WEB', customerGroup: 'vip', isDefault: true,
      });
      expect(pl.getCurrency()).toBe('USD');
      expect(pl.getType().toString()).toBe('WHOLESALE');
      expect(pl.getPriority()).toBe(10);
      expect(pl.getChannel()).toBe('WEB');
      expect(pl.getCustomerGroup()).toBe('vip');
      expect(pl.getIsDefault()).toBe(true);
    });

    it('should throw on invalid date range', () => {
      const future = new Date('2025-01-01');
      const past = new Date('2024-01-01');
      expect(() => PriceList.create({ ...validProps, startsAt: future, endsAt: past })).toThrow(PricingException);
    });

    it('should throw on empty name', () => {
      expect(() => PriceList.create({ ...validProps, name: '' })).toThrow(PricingException);
    });
  });

  describe('activation', () => {
    it('should activate', () => {
      const pl = PriceList.create(validProps);
      pl.deactivate();
      pl.activate();
      expect(pl.getStatus()).toBe('ACTIVE');
    });

    it('should deactivate', () => {
      const pl = PriceList.create(validProps);
      pl.deactivate();
      expect(pl.getStatus()).toBe('INACTIVE');
      expect(pl.isActive()).toBe(false);
    });
  });

  describe('isApplicable', () => {
    it('should be applicable when active and in range', () => {
      const pl = PriceList.create({
        ...validProps, startsAt: new Date('2024-01-01'), endsAt: new Date('2026-01-01'),
      });
      expect(pl.isApplicable(new Date('2025-01-01'))).toBe(true);
    });

    it('should not be applicable when inactive', () => {
      const pl = PriceList.create(validProps);
      pl.deactivate();
      expect(pl.isApplicable(new Date())).toBe(false);
    });

    it('should not be applicable before startsAt', () => {
      const pl = PriceList.create({ ...validProps, startsAt: new Date('2025-01-01') });
      expect(pl.isApplicable(new Date('2024-01-01'))).toBe(false);
    });

    it('should not be applicable after endsAt', () => {
      const pl = PriceList.create({ ...validProps, endsAt: new Date('2024-01-01') });
      expect(pl.isApplicable(new Date('2025-01-01'))).toBe(false);
    });
  });

  describe('default', () => {
    it('should set as default and unset', () => {
      const pl = PriceList.create(validProps);
      pl.setAsDefault();
      expect(pl.getIsDefault()).toBe(true);
      pl.unsetDefault();
      expect(pl.getIsDefault()).toBe(false);
    });
  });

  describe('softDelete', () => {
    it('should soft delete', () => {
      const pl = PriceList.create(validProps);
      pl.softDelete();
      expect(pl.hasBeenDeleted()).toBe(true);
    });

    it('should throw when modifying deleted', () => {
      const pl = PriceList.create(validProps);
      pl.softDelete();
      expect(() => pl.activate()).toThrow(PricingException);
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const pl = PriceList.create(validProps);
      const primitives = pl.toPrimitives();
      const restored = PriceList.fromPrimitives(primitives);
      expect(restored.getId().toString()).toBe(pl.getId().toString());
      expect(restored.getName()).toBe(pl.getName());
      expect(restored.getCode()).toBe(pl.getCode());
      expect(restored.getVersion()).toBe(pl.getVersion());
    });
  });
});
