import { ProductVariant } from '../aggregates/product-variant.aggregate';
import { VariantException, VARIANT_ERROR_CODES } from '../exceptions';
import {
  ProductVariantCreatedEvent,
  ProductVariantSkuChangedEvent,
  ProductVariantAttributesChangedEvent,
  ProductVariantActivatedEvent,
  ProductVariantDeactivatedEvent,
  ProductVariantArchivedEvent,
  ProductVariantRestoredEvent,
  ProductVariantSetAsDefaultEvent,
  ProductVariantDeletedEvent,
} from '../events';

describe('ProductVariant Aggregate', () => {
  const validProps = {
    tenantId: 'tenant-1',
    productId: 'product-1',
    sku: 'T1PRO-NEGRA',
  };

  describe('create', () => {
    it('should create a valid variant', () => {
      const v = ProductVariant.create(validProps);

      expect(v.getId().toString()).toBeDefined();
      expect(v.getTenantId()).toBe('tenant-1');
      expect(v.getProductId()).toBe('product-1');
      expect(v.getSku().toString()).toBe('T1PRO-NEGRA');
      expect(v.getStatus().toString()).toBe('ACTIVE');
      expect(v.getIsDefault()).toBe(false);
      expect(v.getVersion()).toBe(1);
      expect(v.hasBeenDeleted()).toBe(false);
      expect(v.isActive()).toBe(true);
    });

    it('should emit ProductVariantCreatedEvent', () => {
      const v = ProductVariant.create(validProps);
      const events = v.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ProductVariantCreatedEvent);
    });

    it('should normalize SKU to uppercase', () => {
      const v = ProductVariant.create({ ...validProps, sku: 't1pro-plata' });
      expect(v.getSku().toString()).toBe('T1PRO-PLATA');
    });

    it('should accept optional fields', () => {
      const v = ProductVariant.create({
        ...validProps,
        name: 'T1 Pro Black',
        barcode: '123456789012',
        status: 'ACTIVE',
        attributes: [{ name: 'color', value: 'Negra' }, { name: 'size', value: 'M' }],
        isDefault: true,
      });

      expect(v.getName()?.toString()).toBe('T1 Pro Black');
      expect(v.getBarcode()?.toString()).toBe('123456789012');
      expect(v.getStatus().toString()).toBe('ACTIVE');
      expect(v.getAttributes().toArray()).toHaveLength(2);
      expect(v.getIsDefault()).toBe(true);
    });

    it('should throw on empty SKU', () => {
      expect(() => ProductVariant.create({ ...validProps, sku: '' })).toThrow();
    });

    it('should throw on invalid SKU characters', () => {
      expect(() => ProductVariant.create({ ...validProps, sku: 'sku@invalid!' })).toThrow();
    });

    it('should throw on invalid barcode', () => {
      expect(() => ProductVariant.create({ ...validProps, barcode: 'abc' })).toThrow();
    });

    it('should throw on duplicate attributes', () => {
      expect(() => ProductVariant.create({
        ...validProps,
        attributes: [{ name: 'color', value: 'Negra' }, { name: 'color', value: 'Roja' }],
      })).toThrow();
    });
  });

  describe('rename', () => {
    it('should rename variant', () => {
      const v = ProductVariant.create(validProps);
      v.rename('T1 Pro Platinum');
      expect(v.getName()?.toString()).toBe('T1 Pro Platinum');
    });

    it('should set name to null', () => {
      const v = ProductVariant.create({ ...validProps, name: 'Original' });
      v.rename(null);
      expect(v.getName()).toBeNull();
    });

    it('should throw on deleted variant', () => {
      const v = ProductVariant.create(validProps);
      v.softDelete();
      expect(() => v.rename('New Name')).toThrow(VariantException);
    });
  });

  describe('changeSku', () => {
    it('should change SKU', () => {
      const v = ProductVariant.create(validProps);
      v.changeSku('T1PRO-PLATA');
      expect(v.getSku().toString()).toBe('T1PRO-PLATA');
    });

    it('should emit ProductVariantSkuChangedEvent', () => {
      const v = ProductVariant.create(validProps);
      v.clearEvents();
      v.changeSku('T1PRO-PLATA');
      const events = v.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ProductVariantSkuChangedEvent);
    });

    it('should throw on deleted variant', () => {
      const v = ProductVariant.create(validProps);
      v.softDelete();
      expect(() => v.changeSku('NEW-SKU')).toThrow(VariantException);
    });
  });

  describe('changeBarcode', () => {
    it('should change barcode', () => {
      const v = ProductVariant.create(validProps);
      v.changeBarcode('123456789012');
      expect(v.getBarcode()?.toString()).toBe('123456789012');
    });

    it('should clear barcode', () => {
      const v = ProductVariant.create({ ...validProps, barcode: '123456789012' });
      v.changeBarcode(null);
      expect(v.getBarcode()).toBeNull();
    });

    it('should throw on invalid barcode', () => {
      const v = ProductVariant.create(validProps);
      expect(() => v.changeBarcode('invalid')).toThrow();
    });
  });

  describe('updateAttributes', () => {
    it('should update attributes', () => {
      const v = ProductVariant.create(validProps);
      v.updateAttributes([{ name: 'color', value: 'Negra' }]);
      expect(v.getAttributes().toArray()).toHaveLength(1);
      expect(v.getAttributes().getValue('color')).toBe('Negra');
    });

    it('should emit ProductVariantAttributesChangedEvent', () => {
      const v = ProductVariant.create(validProps);
      v.clearEvents();
      v.updateAttributes([{ name: 'color', value: 'Negra' }]);
      expect(v.getEvents()[0]).toBeInstanceOf(ProductVariantAttributesChangedEvent);
    });

    it('should clear attributes with empty array', () => {
      const v = ProductVariant.create({
        ...validProps,
        attributes: [{ name: 'color', value: 'Negra' }],
      });
      v.updateAttributes([]);
      expect(v.getAttributes().isEmpty()).toBe(true);
    });
  });

  describe('status transitions', () => {
    it('should activate from inactive', () => {
      const v = ProductVariant.create({ ...validProps, status: 'INACTIVE' });
      v.activate();
      expect(v.getStatus().toString()).toBe('ACTIVE');
    });

    it('should emit ProductVariantActivatedEvent', () => {
      const v = ProductVariant.create({ ...validProps, status: 'INACTIVE' });
      v.clearEvents();
      v.activate();
      expect(v.getEvents()[0]).toBeInstanceOf(ProductVariantActivatedEvent);
    });

    it('should deactivate from active', () => {
      const v = ProductVariant.create(validProps);
      v.deactivate();
      expect(v.getStatus().toString()).toBe('INACTIVE');
    });

    it('should emit ProductVariantDeactivatedEvent', () => {
      const v = ProductVariant.create(validProps);
      v.clearEvents();
      v.deactivate();
      expect(v.getEvents()[0]).toBeInstanceOf(ProductVariantDeactivatedEvent);
    });

    it('should throw on deactivate from inactive', () => {
      const v = ProductVariant.create({ ...validProps, status: 'INACTIVE' });
      expect(() => v.deactivate()).toThrow(VariantException);
    });

    it('should throw on activate archived variant', () => {
      const v = ProductVariant.create({ ...validProps, status: 'ARCHIVED' });
      expect(() => v.activate()).toThrow(VariantException);
    });
  });

  describe('archive / restore', () => {
    it('should archive an active variant', () => {
      const v = ProductVariant.create(validProps);
      v.archive();
      expect(v.getStatus().toString()).toBe('ARCHIVED');
    });

    it('should emit ProductVariantArchivedEvent', () => {
      const v = ProductVariant.create(validProps);
      v.clearEvents();
      v.archive();
      expect(v.getEvents()[0]).toBeInstanceOf(ProductVariantArchivedEvent);
    });

    it('should throw on archive default variant', () => {
      const v = ProductVariant.create({ ...validProps, isDefault: true });
      expect(() => v.archive()).toThrow(VariantException);
    });

    it('should restore archived variant', () => {
      const v = ProductVariant.create(validProps);
      v.archive();
      v.restore();
      expect(v.getStatus().toString()).toBe('ACTIVE');
    });

    it('should emit ProductVariantRestoredEvent', () => {
      const v = ProductVariant.create(validProps);
      v.archive();
      v.clearEvents();
      v.restore();
      expect(v.getEvents()[0]).toBeInstanceOf(ProductVariantRestoredEvent);
    });

    it('should throw on restore non-archived variant', () => {
      const v = ProductVariant.create(validProps);
      expect(() => v.restore()).toThrow(VariantException);
    });
  });

  describe('default variant', () => {
    it('should set as default', () => {
      const v = ProductVariant.create(validProps);
      v.setAsDefault();
      expect(v.getIsDefault()).toBe(true);
    });

    it('should emit ProductVariantSetAsDefaultEvent', () => {
      const v = ProductVariant.create(validProps);
      v.clearEvents();
      v.setAsDefault();
      expect(v.getEvents()[0]).toBeInstanceOf(ProductVariantSetAsDefaultEvent);
    });

    it('should unset default', () => {
      const v = ProductVariant.create({ ...validProps, isDefault: true });
      v.unsetDefault();
      expect(v.getIsDefault()).toBe(false);
    });

    it('should throw on set archived variant as default', () => {
      const v = ProductVariant.create({ ...validProps, status: 'ARCHIVED' });
      expect(() => v.setAsDefault()).toThrow(VariantException);
    });
  });

  describe('softDelete', () => {
    it('should soft delete variant', () => {
      const v = ProductVariant.create(validProps);
      v.softDelete();
      expect(v.hasBeenDeleted()).toBe(true);
      expect(v.getDeletedAt()).not.toBeNull();
    });

    it('should emit ProductVariantDeletedEvent', () => {
      const v = ProductVariant.create(validProps);
      v.clearEvents();
      v.softDelete();
      expect(v.getEvents()[0]).toBeInstanceOf(ProductVariantDeletedEvent);
    });

    it('should be idempotent', () => {
      const v = ProductVariant.create(validProps);
      v.softDelete();
      v.clearEvents();
      v.softDelete();
      expect(v.getEvents()).toHaveLength(0);
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const v = ProductVariant.create({
        ...validProps,
        name: 'T1 Pro Negra',
        attributes: [{ name: 'color', value: 'Negra' }],
        isDefault: true,
      });
      const primitives = v.toPrimitives();
      const restored = ProductVariant.fromPrimitives(primitives);

      expect(restored.getId().toString()).toBe(v.getId().toString());
      expect(restored.getSku().toString()).toBe(v.getSku().toString());
      expect(restored.getName()?.toString()).toBe(v.getName()?.toString());
      expect(restored.getStatus().toString()).toBe(v.getStatus().toString());
      expect(restored.getVersion()).toBe(v.getVersion());
      expect(restored.getIsDefault()).toBe(true);
      expect(restored.getAttributes().toArray()).toHaveLength(1);
    });
  });

  describe('event management', () => {
    it('should clear events', () => {
      const v = ProductVariant.create(validProps);
      expect(v.getEvents()).toHaveLength(1);
      v.clearEvents();
      expect(v.getEvents()).toHaveLength(0);
    });

    it('should return copy of events', () => {
      const v = ProductVariant.create(validProps);
      const events = v.getEvents();
      events.pop();
      expect(v.getEvents()).toHaveLength(1);
    });
  });
});
