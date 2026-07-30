import { Collection } from '../aggregates/collection.aggregate';
import { CatalogException, CATALOG_ERROR_CODES } from '../exceptions';
import {
  CollectionCreatedEvent, CollectionRenamedEvent,
  CollectionActivatedEvent, CollectionDeactivatedEvent,
  CollectionArchivedEvent, CollectionRestoredEvent,
  CollectionVisibilityChangedEvent, CollectionSeoUpdatedEvent,
  CollectionTypeChangedEvent, CollectionDeletedEvent,
} from '../events';

describe('Collection Aggregate', () => {
  const validProps = {
    tenantId: 'tenant-1',
    name: 'Summer Sale',
    slug: 'summer-sale',
  };

  describe('create', () => {
    it('should create a valid collection', () => {
      const collection = Collection.create(validProps);

      expect(collection.getId().toString()).toBeDefined();
      expect(collection.getTenantId()).toBe('tenant-1');
      expect(collection.getName().toString()).toBe('Summer Sale');
      expect(collection.getSlug().toString()).toBe('summer-sale');
      expect(collection.getType().toString()).toBe('MANUAL');
      expect(collection.getStatus().toString()).toBe('DRAFT');
      expect(collection.getVisibility().toString()).toBe('PUBLIC');
      expect(collection.getDisplayOrder().getValue()).toBe(0);
      expect(collection.getVersion()).toBe(1);
      expect(collection.hasBeenDeleted()).toBe(false);
      expect(collection.isActive()).toBe(false);
      expect(collection.isDraft()).toBe(true);
    });

    it('should emit CollectionCreatedEvent', () => {
      const collection = Collection.create(validProps);
      const events = collection.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CollectionCreatedEvent);
      expect(events[0].eventName).toBe('catalog.collection.created');
    });

    it('should accept optional fields', () => {
      const collection = Collection.create({
        ...validProps,
        description: 'Best deals of summer',
        type: 'FEATURED',
        status: 'ACTIVE',
        visibility: 'PRIVATE',
        displayOrder: 1,
        startAt: new Date('2024-06-01'),
        endAt: new Date('2024-08-31'),
        seoTitle: 'SEO Title',
        seoDescription: 'SEO Desc',
      });

      expect(collection.getDescription().getValue()).toBe('Best deals of summer');
      expect(collection.getType().toString()).toBe('FEATURED');
      expect(collection.getStatus().toString()).toBe('ACTIVE');
      expect(collection.getVisibility().toString()).toBe('PRIVATE');
      expect(collection.getDisplayOrder().getValue()).toBe(1);
      expect(collection.getStartAt()).toEqual(new Date('2024-06-01'));
      expect(collection.getEndAt()).toEqual(new Date('2024-08-31'));
      expect(collection.getSeoTitle().getValue()).toBe('SEO Title');
      expect(collection.getSeoDescription().getValue()).toBe('SEO Desc');
    });

    it('should throw on startAt after endAt', () => {
      expect(() => Collection.create({
        ...validProps,
        startAt: new Date('2024-12-01'),
        endAt: new Date('2024-06-01'),
      })).toThrow(CatalogException);
    });

    it('should throw on empty name', () => {
      expect(() => Collection.create({ ...validProps, name: '' })).toThrow();
    });

    it('should throw on invalid slug', () => {
      expect(() => Collection.create({ ...validProps, slug: 'Invalid Slug!' })).toThrow();
    });
  });

  describe('rename', () => {
    it('should rename collection', () => {
      const collection = Collection.create(validProps);
      collection.rename('Winter Sale');
      expect(collection.getName().toString()).toBe('Winter Sale');
    });

    it('should emit CollectionRenamedEvent', () => {
      const collection = Collection.create(validProps);
      collection.clearEvents();
      collection.rename('Winter Sale');
      const events = collection.getEvents();
      expect(events[0]).toBeInstanceOf(CollectionRenamedEvent);
    });
  });

  describe('status transitions', () => {
    it('should activate a draft collection', () => {
      const collection = Collection.create(validProps);
      collection.activate();
      expect(collection.getStatus().toString()).toBe('ACTIVE');
    });

    it('should emit CollectionActivatedEvent', () => {
      const collection = Collection.create(validProps);
      collection.clearEvents();
      collection.activate();
      const events = collection.getEvents();
      expect(events[0]).toBeInstanceOf(CollectionActivatedEvent);
    });

    it('should deactivate active collection', () => {
      const collection = Collection.create({ ...validProps, status: 'ACTIVE' });
      collection.deactivate();
      expect(collection.getStatus().toString()).toBe('INACTIVE');
    });

    it('should emit CollectionDeactivatedEvent', () => {
      const collection = Collection.create({ ...validProps, status: 'ACTIVE' });
      collection.clearEvents();
      collection.deactivate();
      const events = collection.getEvents();
      expect(events[0]).toBeInstanceOf(CollectionDeactivatedEvent);
    });

    it('should archive collection', () => {
      const collection = Collection.create({ ...validProps, status: 'ACTIVE' });
      collection.archive();
      expect(collection.getStatus().toString()).toBe('ARCHIVED');
    });

    it('should restore archived collection to draft', () => {
      const collection = Collection.create({ ...validProps, status: 'ACTIVE' });
      collection.archive();
      collection.restore();
      expect(collection.getStatus().toString()).toBe('DRAFT');
    });

    it('should emit CollectionRestoredEvent', () => {
      const collection = Collection.create({ ...validProps, status: 'ACTIVE' });
      collection.archive();
      collection.clearEvents();
      collection.restore();
      const events = collection.getEvents();
      expect(events[0]).toBeInstanceOf(CollectionRestoredEvent);
    });

    it('should throw on restore from draft', () => {
      const collection = Collection.create(validProps);
      expect(() => collection.restore()).toThrow();
    });
  });

  describe('changeType', () => {
    it('should change type', () => {
      const collection = Collection.create(validProps);
      collection.changeType('RULE_BASED');
      expect(collection.getType().toString()).toBe('RULE_BASED');
    });

    it('should emit CollectionTypeChangedEvent', () => {
      const collection = Collection.create(validProps);
      collection.clearEvents();
      collection.changeType('FEATURED');
      const events = collection.getEvents();
      expect(events[0]).toBeInstanceOf(CollectionTypeChangedEvent);
    });
  });

  describe('dateRange', () => {
    it('should update date range', () => {
      const collection = Collection.create(validProps);
      collection.updateDateRange(new Date('2024-06-01'), new Date('2024-08-31'));
      expect(collection.getStartAt()).toEqual(new Date('2024-06-01'));
      expect(collection.getEndAt()).toEqual(new Date('2024-08-31'));
    });

    it('should clear dates', () => {
      const collection = Collection.create({
        ...validProps,
        startAt: new Date('2024-06-01'),
        endAt: new Date('2024-08-31'),
      });
      collection.updateDateRange(null, null);
      expect(collection.getStartAt()).toBeNull();
      expect(collection.getEndAt()).toBeNull();
    });

    it('should throw on invalid date range', () => {
      const collection = Collection.create(validProps);
      expect(() => collection.updateDateRange(
        new Date('2024-12-01'),
        new Date('2024-06-01'),
      )).toThrow();
    });
  });

  describe('visibility', () => {
    it('should change visibility', () => {
      const collection = Collection.create(validProps);
      collection.changeVisibility('HIDDEN');
      expect(collection.getVisibility().toString()).toBe('HIDDEN');
    });

    it('should emit CollectionVisibilityChangedEvent', () => {
      const collection = Collection.create(validProps);
      collection.clearEvents();
      collection.changeVisibility('PRIVATE');
      const events = collection.getEvents();
      expect(events[0]).toBeInstanceOf(CollectionVisibilityChangedEvent);
    });
  });

  describe('SEO', () => {
    it('should update seo', () => {
      const collection = Collection.create(validProps);
      collection.updateSeo('New Title', 'New Description');
      expect(collection.getSeoTitle().getValue()).toBe('New Title');
      expect(collection.getSeoDescription().getValue()).toBe('New Description');
    });

    it('should emit CollectionSeoUpdatedEvent', () => {
      const collection = Collection.create(validProps);
      collection.clearEvents();
      collection.updateSeo('Title', 'Desc');
      const events = collection.getEvents();
      expect(events[0]).toBeInstanceOf(CollectionSeoUpdatedEvent);
    });
  });

  describe('updateDisplayOrder', () => {
    it('should update display order', () => {
      const collection = Collection.create(validProps);
      collection.updateDisplayOrder(5);
      expect(collection.getDisplayOrder().getValue()).toBe(5);
    });
  });

  describe('softDelete', () => {
    it('should soft delete collection', () => {
      const collection = Collection.create(validProps);
      collection.softDelete();
      expect(collection.hasBeenDeleted()).toBe(true);
    });

    it('should emit CollectionDeletedEvent', () => {
      const collection = Collection.create(validProps);
      collection.clearEvents();
      collection.softDelete();
      const events = collection.getEvents();
      expect(events[0]).toBeInstanceOf(CollectionDeletedEvent);
    });

    it('should be idempotent', () => {
      const collection = Collection.create(validProps);
      collection.softDelete();
      collection.clearEvents();
      collection.softDelete();
      expect(collection.getEvents()).toHaveLength(0);
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const collection = Collection.create(validProps);
      const primitives = collection.toPrimitives();
      const restored = Collection.fromPrimitives(primitives);

      expect(restored.getId().toString()).toBe(collection.getId().toString());
      expect(restored.getName().toString()).toBe(collection.getName().toString());
      expect(restored.getSlug().toString()).toBe(collection.getSlug().toString());
      expect(restored.getType().toString()).toBe(collection.getType().toString());
      expect(restored.getVersion()).toBe(collection.getVersion());
    });

    it('should throw on invalid date range in fromPrimitives', () => {
      expect(() => Collection.fromPrimitives({
        id: '1',
        tenantId: 't1',
        name: 'Test',
        slug: 'test',
        description: null,
        type: 'MANUAL',
        status: 'DRAFT',
        visibility: 'PUBLIC',
        displayOrder: 0,
        startAt: new Date('2024-12-01'),
        endAt: new Date('2024-06-01'),
        seoTitle: null,
        seoDescription: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        version: 1,
      })).toThrow();
    });
  });
});
