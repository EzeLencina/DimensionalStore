import { Warehouse } from '../aggregates/warehouse.aggregate';
import { InventoryException } from '../exceptions';

describe('Warehouse Aggregate', () => {
  describe('create', () => {
    it('should create a warehouse', () => {
      const w = Warehouse.create({ tenantId: 'tenant-1', name: 'Main Warehouse', code: 'MAIN' });
      expect(w.getName()).toBe('Main Warehouse');
      expect(w.getCode().toString()).toBe('MAIN');
      expect(w.getStatus()).toBe('ACTIVE');
      expect(w.getIsDefault()).toBe(false);
    });

    it('should normalize code to uppercase', () => {
      const w = Warehouse.create({ tenantId: 'tenant-1', name: 'Secondary', code: 'sec-01' });
      expect(w.getCode().toString()).toBe('SEC-01');
    });

    it('should throw on empty code', () => {
      expect(() => Warehouse.create({ tenantId: 'tenant-1', name: 'Test', code: '' })).toThrow();
    });
  });

  describe('status transitions', () => {
    it('should activate and deactivate', () => {
      const w = Warehouse.create({ tenantId: 'tenant-1', name: 'WH', code: 'WH01', status: 'INACTIVE' });
      w.activate();
      expect(w.getStatus()).toBe('ACTIVE');
      w.deactivate();
      expect(w.getStatus()).toBe('INACTIVE');
    });
  });

  describe('default', () => {
    it('should set and unset default', () => {
      const w = Warehouse.create({ tenantId: 'tenant-1', name: 'WH', code: 'WH01' });
      w.setAsDefault();
      expect(w.getIsDefault()).toBe(true);
      w.unsetDefault();
      expect(w.getIsDefault()).toBe(false);
    });
  });

  describe('softDelete', () => {
    it('should soft delete', () => {
      const w = Warehouse.create({ tenantId: 'tenant-1', name: 'WH', code: 'WH01' });
      w.softDelete();
      expect(w.hasBeenDeleted()).toBe(true);
    });

    it('should prevent modification after delete', () => {
      const w = Warehouse.create({ tenantId: 'tenant-1', name: 'WH', code: 'WH01' });
      w.softDelete();
      expect(() => w.rename('New')).toThrow(InventoryException);
    });
  });
});
