import { Product } from '../aggregates/product.aggregate';
import { ProductException, PRODUCT_ERROR_CODES } from '../exceptions';
import { ProductCreatedEvent, ProductActivatedEvent, ProductDeactivatedEvent, ProductArchivedEvent, ProductRestoredEvent, ProductRenamedEvent, ProductVisibilityChangedEvent, ProductSeoUpdatedEvent, ProductDeletedEvent } from '../events';

describe('Product Aggregate', () => {
  const validProps = {
    tenantId: 'tenant-1',
    name: 'Smart Lock Pro',
    slug: 'smart-lock-pro',
  };

  describe('create', () => {
    it('should create a valid product', () => {
      const product = Product.create(validProps);

      expect(product.getId().toString()).toBeDefined();
      expect(product.getTenantId()).toBe('tenant-1');
      expect(product.getName().toString()).toBe('Smart Lock Pro');
      expect(product.getSlug().toString()).toBe('smart-lock-pro');
      expect(product.getStatus().toString()).toBe('DRAFT');
      expect(product.getVisibility().toString()).toBe('PUBLIC');
      expect(product.getCondition().toString()).toBe('NEW');
      expect(product.getProductType().toString()).toBe('PHYSICAL');
      expect(product.getVersion()).toBe(1);
      expect(product.hasBeenDeleted()).toBe(false);
      expect(product.isActive()).toBe(false);
      expect(product.isDraft()).toBe(true);
    });

    it('should emit ProductCreatedEvent', () => {
      const product = Product.create(validProps);
      const events = product.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ProductCreatedEvent);
      expect(events[0].eventName).toBe('products.product.created');
    });

    it('should normalize name spaces', () => {
      const product = Product.create({ ...validProps, name: '  Smart   Lock  Pro  ' });
      expect(product.getName().toString()).toBe('Smart Lock Pro');
    });

    it('should throw on empty name', () => {
      expect(() => Product.create({ ...validProps, name: '' })).toThrow();
    });

    it('should throw on invalid slug', () => {
      expect(() => Product.create({ ...validProps, slug: 'Invalid Slug!' })).toThrow();
    });

    it('should accept optional fields', () => {
      const product = Product.create({
        ...validProps,
        shortDescription: 'A great lock',
        description: 'Full description',
        warrantyMonths: 12,
        seoTitle: 'SEO Title',
        seoDescription: 'SEO Desc',
      });

      expect(product.getShortDescription().toString()).toBe('A great lock');
      expect(product.getDescription().toString()).toBe('Full description');
      expect(product.getWarrantyPeriod().getValue()).toBe(12);
      expect(product.getSeoTitle().toString()).toBe('SEO Title');
      expect(product.getSeoDescription().toString()).toBe('SEO Desc');
    });
  });

  describe('status transitions', () => {
    it('should activate a draft product', () => {
      const product = Product.create(validProps);
      product.activate();
      expect(product.getStatus().toString()).toBe('ACTIVE');
      expect(product.isActive()).toBe(true);
    });

    it('should emit ProductActivatedEvent', () => {
      const product = Product.create(validProps);
      product.activate();
      const events = product.getEvents();
      expect(events.some(e => e instanceof ProductActivatedEvent)).toBe(true);
    });

    it('should deactivate an active product', () => {
      const product = Product.create(validProps);
      product.activate();
      product.deactivate();
      expect(product.getStatus().toString()).toBe('INACTIVE');
    });

    it('should archive a draft product', () => {
      const product = Product.create(validProps);
      product.archive();
      expect(product.getStatus().toString()).toBe('ARCHIVED');
    });

    it('should not activate an archived product directly', () => {
      const product = Product.create(validProps);
      product.archive();
      expect(() => product.activate()).toThrow(ProductException);
    });

    it('should restore an archived product to draft', () => {
      const product = Product.create(validProps);
      product.archive();
      product.restore();
      expect(product.getStatus().toString()).toBe('DRAFT');
    });

    it('should not restore a non-archived product', () => {
      const product = Product.create(validProps);
      expect(() => product.restore()).toThrow(ProductException);
    });

    it('should not deactivate a draft directly', () => {
      const product = Product.create(validProps);
      expect(() => product.deactivate()).toThrow(ProductException);
    });

    it('should emit events for each transition', () => {
      const product = Product.create(validProps);
      product.clearEvents();

      product.activate();
      expect(product.getEvents().some(e => e instanceof ProductActivatedEvent)).toBe(true);

      product.clearEvents();
      product.deactivate();
      expect(product.getEvents().some(e => e instanceof ProductDeactivatedEvent)).toBe(true);

      product.clearEvents();
      product.archive();
      expect(product.getEvents().some(e => e instanceof ProductArchivedEvent)).toBe(true);

      product.clearEvents();
      product.restore();
      expect(product.getEvents().some(e => e instanceof ProductRestoredEvent)).toBe(true);
    });
  });

  describe('rename', () => {
    it('should rename a product', () => {
      const product = Product.create(validProps);
      product.rename('Smart Lock Ultra');
      expect(product.getName().toString()).toBe('Smart Lock Ultra');
    });

    it('should emit ProductRenamedEvent', () => {
      const product = Product.create(validProps);
      product.clearEvents();
      product.rename('New Name');
      const events = product.getEvents();
      expect(events.some(e => e instanceof ProductRenamedEvent)).toBe(true);
    });

    it('should throw if renamed after deletion', () => {
      const product = Product.create(validProps);
      product.softDelete();
      expect(() => product.rename('New Name')).toThrow(ProductException);
    });
  });

  describe('visibility', () => {
    it('should change visibility', () => {
      const product = Product.create(validProps);
      product.changeVisibility('PRIVATE');
      expect(product.getVisibility().toString()).toBe('PRIVATE');
    });

    it('should emit ProductVisibilityChangedEvent', () => {
      const product = Product.create(validProps);
      product.clearEvents();
      product.changeVisibility('HIDDEN');
      expect(product.getEvents().some(e => e instanceof ProductVisibilityChangedEvent)).toBe(true);
    });
  });

  describe('SEO', () => {
    it('should update SEO fields', () => {
      const product = Product.create(validProps);
      product.updateSeo('New SEO Title', 'New SEO Description');
      expect(product.getSeoTitle().toString()).toBe('New SEO Title');
      expect(product.getSeoDescription().toString()).toBe('New SEO Description');
    });

    it('should emit ProductSeoUpdatedEvent', () => {
      const product = Product.create(validProps);
      product.clearEvents();
      product.updateSeo('Title', 'Desc');
      expect(product.getEvents().some(e => e instanceof ProductSeoUpdatedEvent)).toBe(true);
    });
  });

  describe('soft delete', () => {
    it('should mark product as deleted', () => {
      const product = Product.create(validProps);
      expect(product.hasBeenDeleted()).toBe(false);
      product.softDelete();
      expect(product.hasBeenDeleted()).toBe(true);
      expect(product.getDeletedAt()).toBeInstanceOf(Date);
    });

    it('should emit ProductDeletedEvent', () => {
      const product = Product.create(validProps);
      product.clearEvents();
      product.softDelete();
      expect(product.getEvents().some(e => e instanceof ProductDeletedEvent)).toBe(true);
    });

    it('should be idempotent', () => {
      const product = Product.create(validProps);
      product.softDelete();
      const deletedAt1 = product.getDeletedAt();
      product.softDelete();
      expect(product.getDeletedAt()).toEqual(deletedAt1);
    });

    it('should throw on modify after delete', () => {
      const product = Product.create(validProps);
      product.softDelete();
      expect(() => product.activate()).toThrow(ProductException);
      expect(() => product.rename('New')).toThrow(ProductException);
      expect(() => product.changeVisibility('PUBLIC')).toThrow(ProductException);
    });
  });

  describe('warranty', () => {
    it('should define warranty', () => {
      const product = Product.create(validProps);
      product.defineWarranty(24);
      expect(product.getWarrantyPeriod().getValue()).toBe(24);
    });

    it('should clear warranty with null', () => {
      const product = Product.create({ ...validProps, warrantyMonths: 12 });
      product.defineWarranty(null);
      expect(product.getWarrantyPeriod().getValue()).toBeNull();
    });

    it('should throw on negative warranty', () => {
      const product = Product.create(validProps);
      expect(() => product.defineWarranty(-1)).toThrow();
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip through primitives', () => {
      const product = Product.create({
        ...validProps,
        shortDescription: 'Short',
        description: 'Long desc',
        warrantyMonths: 6,
        seoTitle: 'SEO',
        seoDescription: 'SEO desc',
      });
      product.activate();
      product.changeVisibility('HIDDEN');

      const primitives = product.toPrimitives();
      const restored = Product.fromPrimitives(primitives);

      expect(restored.getId().toString()).toBe(product.getId().toString());
      expect(restored.getName().toString()).toBe(product.getName().toString());
      expect(restored.getSlug().toString()).toBe(product.getSlug().toString());
      expect(restored.getStatus().toString()).toBe('ACTIVE');
      expect(restored.getVisibility().toString()).toBe('HIDDEN');
      expect(restored.getWarrantyPeriod().getValue()).toBe(6);
      expect(restored.getVersion()).toBe(product.getVersion());
    });

    it('should preserve deleted state', () => {
      const product = Product.create(validProps);
      product.softDelete();
      const primitives = product.toPrimitives();
      const restored = Product.fromPrimitives(primitives);
      expect(restored.hasBeenDeleted()).toBe(true);
      expect(restored.getDeletedAt()).toBeInstanceOf(Date);
    });
  });

  describe('versioning', () => {
    it('should increment version', () => {
      const product = Product.create(validProps);
      expect(product.getVersion()).toBe(1);
      product.incrementVersion();
      expect(product.getVersion()).toBe(2);
    });
  });

  describe('changeSlug', () => {
    it('should change slug', () => {
      const product = Product.create(validProps);
      product.changeSlug('smart-lock-ultra');
      expect(product.getSlug().toString()).toBe('smart-lock-ultra');
    });

    it('should throw on invalid slug', () => {
      const product = Product.create(validProps);
      expect(() => product.changeSlug('Invalid Slug!')).toThrow();
    });
  });

  describe('updateShortDescription / updateDescription', () => {
    it('should update short description', () => {
      const product = Product.create(validProps);
      product.updateShortDescription('New short');
      expect(product.getShortDescription().toString()).toBe('New short');
    });

    it('should update description', () => {
      const product = Product.create(validProps);
      product.updateDescription('New long description');
      expect(product.getDescription().toString()).toBe('New long description');
    });

    it('should clear descriptions with null', () => {
      const product = Product.create({ ...validProps, shortDescription: 'Old', description: 'Old desc' });
      product.updateShortDescription(null);
      product.updateDescription(null);
      expect(product.getShortDescription().getValue()).toBeNull();
      expect(product.getDescription().getValue()).toBeNull();
    });
  });
});
