import { Category } from '../aggregates/category.aggregate';
import { CatalogException, CATALOG_ERROR_CODES } from '../exceptions';
import {
  CategoryCreatedEvent, CategoryRenamedEvent,
  CategoryActivatedEvent, CategoryDeactivatedEvent,
  CategoryArchivedEvent, CategoryRestoredEvent,
  CategoryVisibilityChangedEvent, CategorySeoUpdatedEvent,
  CategoryMovedEvent, CategoryDeletedEvent,
} from '../events';

describe('Category Aggregate', () => {
  const validProps = {
    tenantId: 'tenant-1',
    name: 'Electronics',
    slug: 'electronics',
  };

  describe('create', () => {
    it('should create a valid category', () => {
      const category = Category.create(validProps);

      expect(category.getId().toString()).toBeDefined();
      expect(category.getTenantId()).toBe('tenant-1');
      expect(category.getName().toString()).toBe('Electronics');
      expect(category.getSlug().toString()).toBe('electronics');
      expect(category.getStatus().toString()).toBe('DRAFT');
      expect(category.getVisibility().toString()).toBe('PUBLIC');
      expect(category.getDisplayOrder().getValue()).toBe(0);
      expect(category.getVersion()).toBe(1);
      expect(category.hasBeenDeleted()).toBe(false);
      expect(category.isActive()).toBe(false);
      expect(category.isDraft()).toBe(true);
      expect(category.isRoot()).toBe(true);
    });

    it('should emit CategoryCreatedEvent', () => {
      const category = Category.create(validProps);
      const events = category.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CategoryCreatedEvent);
      expect(events[0].eventName).toBe('catalog.category.created');
    });

    it('should accept optional fields', () => {
      const category = Category.create({
        ...validProps,
        parentId: 'parent-1',
        description: 'All electronics',
        shortDescription: 'Electronics category',
        status: 'ACTIVE',
        visibility: 'PRIVATE',
        displayOrder: 3,
        icon: 'https://example.com/icon.png',
        image: 'https://example.com/image.png',
        seoTitle: 'SEO Title',
        seoDescription: 'SEO Desc',
      });

      expect(category.getParentId()).toBe('parent-1');
      expect(category.getDescription().getValue()).toBe('All electronics');
      expect(category.getShortDescription().getValue()).toBe('Electronics category');
      expect(category.getStatus().toString()).toBe('ACTIVE');
      expect(category.getVisibility().toString()).toBe('PRIVATE');
      expect(category.getDisplayOrder().getValue()).toBe(3);
      expect(category.getIcon().getValue()).toBe('https://example.com/icon.png');
      expect(category.getImage().getValue()).toBe('https://example.com/image.png');
      expect(category.getSeoTitle().getValue()).toBe('SEO Title');
      expect(category.getSeoDescription().getValue()).toBe('SEO Desc');
    });

    it('should throw on empty name', () => {
      expect(() => Category.create({ ...validProps, name: '' })).toThrow();
    });

    it('should throw on invalid slug', () => {
      expect(() => Category.create({ ...validProps, slug: 'Invalid Slug!' })).toThrow();
    });
  });

  describe('rename', () => {
    it('should rename category', () => {
      const category = Category.create(validProps);
      category.rename('Home & Garden');

      expect(category.getName().toString()).toBe('Home & Garden');
    });

    it('should emit CategoryRenamedEvent', () => {
      const category = Category.create(validProps);
      category.clearEvents();
      category.rename('Home & Garden');

      const events = category.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CategoryRenamedEvent);
    });

    it('should throw on deleted category', () => {
      const category = Category.create(validProps);
      category.softDelete();
      expect(() => category.rename('New Name')).toThrow();
    });
  });

  describe('status transitions', () => {
    it('should activate a draft category', () => {
      const category = Category.create(validProps);
      category.activate();
      expect(category.getStatus().toString()).toBe('ACTIVE');
      expect(category.isActive()).toBe(true);
    });

    it('should emit CategoryActivatedEvent', () => {
      const category = Category.create(validProps);
      category.clearEvents();
      category.activate();
      const events = category.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CategoryActivatedEvent);
    });

    it('should deactivate an active category', () => {
      const category = Category.create({ ...validProps, status: 'ACTIVE' });
      category.deactivate();
      expect(category.getStatus().toString()).toBe('INACTIVE');
    });

    it('should emit CategoryDeactivatedEvent', () => {
      const category = Category.create({ ...validProps, status: 'ACTIVE' });
      category.clearEvents();
      category.deactivate();
      const events = category.getEvents();
      expect(events[0]).toBeInstanceOf(CategoryDeactivatedEvent);
    });

    it('should archive an active category', () => {
      const category = Category.create({ ...validProps, status: 'ACTIVE' });
      category.archive();
      expect(category.getStatus().toString()).toBe('ARCHIVED');
    });

    it('should emit CategoryArchivedEvent', () => {
      const category = Category.create({ ...validProps, status: 'ACTIVE' });
      category.clearEvents();
      category.archive();
      const events = category.getEvents();
      expect(events[0]).toBeInstanceOf(CategoryArchivedEvent);
    });

    it('should restore an archived category to draft', () => {
      const category = Category.create({ ...validProps, status: 'ACTIVE' });
      category.archive();
      category.restore();
      expect(category.getStatus().toString()).toBe('DRAFT');
    });

    it('should emit CategoryRestoredEvent', () => {
      const category = Category.create({ ...validProps, status: 'ACTIVE' });
      category.archive();
      category.clearEvents();
      category.restore();
      const events = category.getEvents();
      expect(events[0]).toBeInstanceOf(CategoryRestoredEvent);
    });

    it('should archive from draft', () => {
      const category = Category.create({ ...validProps, status: 'ACTIVE' });
      category.archive();
      expect(category.getStatus().toString()).toBe('ARCHIVED');
    });

    it('should throw on invalid transition from draft to inactive', () => {
      const category = Category.create(validProps);
      expect(() => category.deactivate()).toThrow();
    });

    it('should throw on restore from draft', () => {
      const category = Category.create(validProps);
      expect(() => category.restore()).toThrow();
    });
  });

  describe('changeSlug', () => {
    it('should change slug', () => {
      const category = Category.create(validProps);
      category.changeSlug('home-and-garden');
      expect(category.getSlug().toString()).toBe('home-and-garden');
    });
  });

  describe('moveTo', () => {
    it('should change parent', () => {
      const category = Category.create(validProps);
      category.moveTo('parent-1');
      expect(category.getParentId()).toBe('parent-1');
    });

    it('should make root when parent is null', () => {
      const category = Category.create({ ...validProps, parentId: 'parent-1' });
      category.moveTo(null);
      expect(category.getParentId()).toBeNull();
      expect(category.isRoot()).toBe(true);
    });

    it('should emit CategoryMovedEvent', () => {
      const category = Category.create(validProps);
      category.clearEvents();
      category.moveTo('parent-1');
      const events = category.getEvents();
      expect(events[0]).toBeInstanceOf(CategoryMovedEvent);
    });

    it('should throw on self-reference', () => {
      const category = Category.create({ ...validProps, parentId: null });
      expect(() => category.moveTo(category.getId().toString())).toThrow();
    });
  });

  describe('visibility', () => {
    it('should change visibility', () => {
      const category = Category.create(validProps);
      category.changeVisibility('PRIVATE');
      expect(category.getVisibility().toString()).toBe('PRIVATE');
    });

    it('should emit CategoryVisibilityChangedEvent', () => {
      const category = Category.create(validProps);
      category.clearEvents();
      category.changeVisibility('PRIVATE');
      const events = category.getEvents();
      expect(events[0]).toBeInstanceOf(CategoryVisibilityChangedEvent);
    });
  });

  describe('SEO', () => {
    it('should update seo', () => {
      const category = Category.create(validProps);
      category.updateSeo('New Title', 'New Description');
      expect(category.getSeoTitle().getValue()).toBe('New Title');
      expect(category.getSeoDescription().getValue()).toBe('New Description');
    });

    it('should emit CategorySeoUpdatedEvent', () => {
      const category = Category.create(validProps);
      category.clearEvents();
      category.updateSeo('Title', 'Desc');
      const events = category.getEvents();
      expect(events[0]).toBeInstanceOf(CategorySeoUpdatedEvent);
    });
  });

  describe('updateDisplayOrder', () => {
    it('should update display order', () => {
      const category = Category.create(validProps);
      category.updateDisplayOrder(10);
      expect(category.getDisplayOrder().getValue()).toBe(10);
    });
  });

  describe('softDelete', () => {
    it('should soft delete category', () => {
      const category = Category.create(validProps);
      category.softDelete();
      expect(category.hasBeenDeleted()).toBe(true);
      expect(category.getDeletedAt()).not.toBeNull();
    });

    it('should emit CategoryDeletedEvent', () => {
      const category = Category.create(validProps);
      category.clearEvents();
      category.softDelete();
      const events = category.getEvents();
      expect(events[0]).toBeInstanceOf(CategoryDeletedEvent);
    });

    it('should be idempotent', () => {
      const category = Category.create(validProps);
      category.softDelete();
      category.clearEvents();
      category.softDelete();
      expect(category.getEvents()).toHaveLength(0);
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const category = Category.create(validProps);
      const primitives = category.toPrimitives();
      const restored = Category.fromPrimitives(primitives);

      expect(restored.getId().toString()).toBe(category.getId().toString());
      expect(restored.getName().toString()).toBe(category.getName().toString());
      expect(restored.getSlug().toString()).toBe(category.getSlug().toString());
      expect(restored.getStatus().toString()).toBe(category.getStatus().toString());
      expect(restored.getVersion()).toBe(category.getVersion());
    });
  });

  describe('event management', () => {
    it('should clear events', () => {
      const category = Category.create(validProps);
      expect(category.getEvents()).toHaveLength(1);
      category.clearEvents();
      expect(category.getEvents()).toHaveLength(0);
    });

    it('should return copy of events', () => {
      const category = Category.create(validProps);
      const events = category.getEvents();
      events.pop();
      expect(category.getEvents()).toHaveLength(1);
    });
  });
});
