import { InventoryItem } from '../aggregates/inventory-item.aggregate';
import { InventoryException, INVENTORY_ERROR_CODES } from '../exceptions';

describe('InventoryItem Aggregate', () => {
  const validProps = () => ({
    tenantId: 'tenant-1', warehouseId: 'wh-1', productVariantId: 'pv-1', sku: 'T1PRO-NEGRA',
  });

  describe('create', () => {
    it('should create with zero stock', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001');
      expect(item.getOnHand()).toBe(0);
      expect(item.getReserved()).toBe(0);
      expect(item.getAvailable()).toBe(0);
      expect(item.getVersion()).toBe(1);
    });

    it('should create with initial stock', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 100);
      expect(item.getOnHand()).toBe(100);
      expect(item.getAvailable()).toBe(100);
    });

    it('should throw on negative initial stock', () => {
      expect(() => InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', -1)).toThrow(InventoryException);
    });
  });

  describe('receive', () => {
    it('should increase onHand and available', () => {
      const item = InventoryItem.create(...Object.values(validProps()) as any, 50);
      item.receive(30);
      expect(item.getOnHand()).toBe(80);
      expect(item.getAvailable()).toBe(80);
    });

    it('should throw on non-positive quantity', () => {
      const item = InventoryItem.create(...Object.values(validProps()) as any);
      expect(() => item.receive(0)).toThrow(InventoryException);
      expect(() => item.receive(-5)).toThrow(InventoryException);
    });
  });

  describe('dispatch', () => {
    it('should decrease onHand and available', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 50);
      item.dispatch(20);
      expect(item.getOnHand()).toBe(30);
      expect(item.getAvailable()).toBe(30);
    });

    it('should throw on insufficient stock', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 10);
      expect(() => item.dispatch(20)).toThrow(InventoryException);
    });

    it('should throw on non-positive quantity', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 10);
      expect(() => item.dispatch(0)).toThrow(InventoryException);
    });
  });

  describe('adjust', () => {
    it('should set onHand to new value', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 50);
      item.adjust(75);
      expect(item.getOnHand()).toBe(75);
    });

    it('should throw on negative onHand', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 50);
      expect(() => item.adjust(-1)).toThrow(InventoryException);
    });

    it('should throw if adjustment makes available negative', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 10);
      item.reserve(5);
      expect(() => item.adjust(2)).toThrow(InventoryException);
    });
  });

  describe('reserve / release / consume', () => {
    it('should reserve stock', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 50);
      item.reserve(10);
      expect(item.getReserved()).toBe(10);
      expect(item.getAvailable()).toBe(40);
    });

    it('should throw on reserve exceeding available', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 10);
      expect(() => item.reserve(20)).toThrow(InventoryException);
    });

    it('should release reservation', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 50);
      item.reserve(10);
      item.releaseReservation(5);
      expect(item.getReserved()).toBe(5);
      expect(item.getAvailable()).toBe(45);
    });

    it('should throw on release exceeding reserved', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 50);
      item.reserve(5);
      expect(() => item.releaseReservation(10)).toThrow(InventoryException);
    });

    it('should consume reservation', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 50);
      item.reserve(10);
      item.consumeReservation(10);
      expect(item.getOnHand()).toBe(40);
      expect(item.getReserved()).toBe(0);
      expect(item.getAvailable()).toBe(40);
    });
  });

  describe('minimum stock', () => {
    it('should detect low stock', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 10);
      item.setMinimumStock(15);
      expect(item.isLowStock()).toBe(true);
    });

    it('should not detect low stock when above threshold', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 20);
      item.setMinimumStock(10);
      expect(item.isLowStock()).toBe(false);
    });

    it('should throw on negative minimum stock', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 10);
      expect(() => item.setMinimumStock(-1)).toThrow(InventoryException);
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const item = InventoryItem.create('tenant-1', 'wh-1', 'pv-1', 'SKU-001', 100);
      item.reserve(20);
      const primitives = item.toPrimitives();
      const restored = InventoryItem.fromPrimitives(primitives);
      expect(restored.getOnHand()).toBe(100);
      expect(restored.getReserved()).toBe(20);
      expect(restored.getAvailable()).toBe(80);
      expect(restored.getVersion()).toBe(2);
    });
  });
});
