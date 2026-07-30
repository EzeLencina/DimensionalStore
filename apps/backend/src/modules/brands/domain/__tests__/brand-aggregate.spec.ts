import { Brand } from '../aggregates/brand.aggregate';
import { BrandException, BRAND_ERROR_CODES } from '../exceptions';
import {
  BrandCreatedEvent, BrandRenamedEvent,
  BrandActivatedEvent, BrandDeactivatedEvent,
  BrandArchivedEvent, BrandRestoredEvent,
  BrandVisibilityChangedEvent, BrandSeoUpdatedEvent,
  BrandDeletedEvent,
} from '../events';

describe('Brand Aggregate', () => {
  const validProps = {
    tenantId: 'tenant-1',
    name: 'Nike',
    slug: 'nike',
  };

  describe('create', () => {
    it('should create a valid brand', () => {
      const brand = Brand.create(validProps);

      expect(brand.getId().toString()).toBeDefined();
      expect(brand.getTenantId()).toBe('tenant-1');
      expect(brand.getName().toString()).toBe('Nike');
      expect(brand.getSlug().toString()).toBe('nike');
      expect(brand.getStatus().toString()).toBe('DRAFT');
      expect(brand.getVisibility().toString()).toBe('PUBLIC');
      expect(brand.getVersion()).toBe(1);
      expect(brand.hasBeenDeleted()).toBe(false);
      expect(brand.isActive()).toBe(false);
      expect(brand.isDraft()).toBe(true);
    });

    it('should emit BrandCreatedEvent', () => {
      const brand = Brand.create(validProps);
      const events = brand.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BrandCreatedEvent);
    });

    it('should accept optional fields', () => {
      const brand = Brand.create({
        ...validProps,
        description: 'Sportswear brand',
        logoUrl: 'https://example.com/logo.png',
        websiteUrl: 'https://nike.com',
        status: 'ACTIVE',
        visibility: 'PUBLIC',
        seoTitle: 'SEO Title',
        seoDescription: 'SEO Desc',
      });

      expect(brand.getDescription().getValue()).toBe('Sportswear brand');
      expect(brand.getLogoUrl().getValue()).toBe('https://example.com/logo.png');
      expect(brand.getWebsiteUrl().getValue()).toBe('https://nike.com');
      expect(brand.getStatus().toString()).toBe('ACTIVE');
      expect(brand.getVisibility().toString()).toBe('PUBLIC');
      expect(brand.getSeoTitle().getValue()).toBe('SEO Title');
      expect(brand.getSeoDescription().getValue()).toBe('SEO Desc');
    });

    it('should throw on empty name', () => {
      expect(() => Brand.create({ ...validProps, name: '' })).toThrow();
    });

    it('should throw on invalid slug', () => {
      expect(() => Brand.create({ ...validProps, slug: 'Invalid Slug!' })).toThrow();
    });
  });

  describe('rename', () => {
    it('should rename brand', () => {
      const brand = Brand.create(validProps);
      brand.rename('Adidas');

      expect(brand.getName().toString()).toBe('Adidas');
    });

    it('should emit BrandRenamedEvent', () => {
      const brand = Brand.create(validProps);
      brand.clearEvents();
      brand.rename('Adidas');

      const events = brand.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BrandRenamedEvent);
    });

    it('should throw on deleted brand', () => {
      const brand = Brand.create(validProps);
      brand.softDelete();
      expect(() => brand.rename('New Name')).toThrow();
    });
  });

  describe('status transitions', () => {
    it('should activate a draft brand', () => {
      const brand = Brand.create(validProps);
      brand.activate();
      expect(brand.getStatus().toString()).toBe('ACTIVE');
      expect(brand.isActive()).toBe(true);
    });

    it('should emit BrandActivatedEvent', () => {
      const brand = Brand.create(validProps);
      brand.clearEvents();
      brand.activate();
      const events = brand.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BrandActivatedEvent);
    });

    it('should deactivate an active brand', () => {
      const brand = Brand.create({ ...validProps, status: 'ACTIVE' });
      brand.deactivate();
      expect(brand.getStatus().toString()).toBe('INACTIVE');
    });

    it('should emit BrandDeactivatedEvent', () => {
      const brand = Brand.create({ ...validProps, status: 'ACTIVE' });
      brand.clearEvents();
      brand.deactivate();
      const events = brand.getEvents();
      expect(events[0]).toBeInstanceOf(BrandDeactivatedEvent);
    });

    it('should throw on invalid transition from draft to inactive', () => {
      const brand = Brand.create(validProps);
      expect(() => brand.deactivate()).toThrow(BrandException);
    });

    it('should throw on restore from draft', () => {
      const brand = Brand.create(validProps);
      expect(() => brand.restore()).toThrow(BrandException);
    });
  });

  describe('archive / restore', () => {
    it('should archive an active brand when visibility is private', () => {
      const brand = Brand.create({ ...validProps, status: 'ACTIVE', visibility: 'PRIVATE' });
      brand.archive();
      expect(brand.getStatus().toString()).toBe('ARCHIVED');
    });

    it('should emit BrandArchivedEvent', () => {
      const brand = Brand.create({ ...validProps, status: 'ACTIVE', visibility: 'PRIVATE' });
      brand.clearEvents();
      brand.archive();
      const events = brand.getEvents();
      expect(events[0]).toBeInstanceOf(BrandArchivedEvent);
    });

    it('should throw when archiving a public brand', () => {
      const brand = Brand.create({ ...validProps, status: 'ACTIVE', visibility: 'PUBLIC' });
      expect(() => brand.archive()).toThrow(BrandException);
    });

    it('should restore an archived brand to draft', () => {
      const brand = Brand.create({ ...validProps, status: 'ACTIVE', visibility: 'PRIVATE' });
      brand.archive();
      brand.restore();
      expect(brand.getStatus().toString()).toBe('DRAFT');
    });

    it('should emit BrandRestoredEvent', () => {
      const brand = Brand.create({ ...validProps, status: 'ACTIVE', visibility: 'PRIVATE' });
      brand.archive();
      brand.clearEvents();
      brand.restore();
      const events = brand.getEvents();
      expect(events[0]).toBeInstanceOf(BrandRestoredEvent);
    });
  });

  describe('changeSlug', () => {
    it('should change slug', () => {
      const brand = Brand.create(validProps);
      brand.changeSlug('nike-sports');
      expect(brand.getSlug().toString()).toBe('nike-sports');
    });
  });

  describe('description / logo / website', () => {
    it('should update description', () => {
      const brand = Brand.create(validProps);
      brand.updateDescription('New description');
      expect(brand.getDescription().getValue()).toBe('New description');
    });

    it('should update logo', () => {
      const brand = Brand.create(validProps);
      brand.updateLogo('https://example.com/new-logo.png');
      expect(brand.getLogoUrl().getValue()).toBe('https://example.com/new-logo.png');
    });

    it('should update website', () => {
      const brand = Brand.create(validProps);
      brand.updateWebsite('https://example.com');
      expect(brand.getWebsiteUrl().getValue()).toBe('https://example.com');
    });
  });

  describe('visibility', () => {
    it('should change visibility', () => {
      const brand = Brand.create(validProps);
      brand.changeVisibility('PRIVATE');
      expect(brand.getVisibility().toString()).toBe('PRIVATE');
    });

    it('should emit BrandVisibilityChangedEvent', () => {
      const brand = Brand.create(validProps);
      brand.clearEvents();
      brand.changeVisibility('PRIVATE');
      const events = brand.getEvents();
      expect(events[0]).toBeInstanceOf(BrandVisibilityChangedEvent);
    });

    it('should throw when setting archived brand to public', () => {
      const brand = Brand.create({ ...validProps, status: 'ARCHIVED', visibility: 'HIDDEN' });
      expect(() => brand.changeVisibility('PUBLIC')).toThrow(BrandException);
    });
  });

  describe('SEO', () => {
    it('should update seo', () => {
      const brand = Brand.create(validProps);
      brand.updateSeo('New Title', 'New Description');
      expect(brand.getSeoTitle().getValue()).toBe('New Title');
      expect(brand.getSeoDescription().getValue()).toBe('New Description');
    });

    it('should emit BrandSeoUpdatedEvent', () => {
      const brand = Brand.create(validProps);
      brand.clearEvents();
      brand.updateSeo('Title', 'Desc');
      const events = brand.getEvents();
      expect(events[0]).toBeInstanceOf(BrandSeoUpdatedEvent);
    });
  });

  describe('softDelete', () => {
    it('should soft delete brand', () => {
      const brand = Brand.create(validProps);
      brand.softDelete();
      expect(brand.hasBeenDeleted()).toBe(true);
      expect(brand.getDeletedAt()).not.toBeNull();
    });

    it('should emit BrandDeletedEvent', () => {
      const brand = Brand.create(validProps);
      brand.clearEvents();
      brand.softDelete();
      const events = brand.getEvents();
      expect(events[0]).toBeInstanceOf(BrandDeletedEvent);
    });

    it('should be idempotent', () => {
      const brand = Brand.create(validProps);
      brand.softDelete();
      brand.clearEvents();
      brand.softDelete();
      expect(brand.getEvents()).toHaveLength(0);
    });
  });

  describe('fromPrimitives / toPrimitives', () => {
    it('should round-trip', () => {
      const brand = Brand.create(validProps);
      const primitives = brand.toPrimitives();
      const restored = Brand.fromPrimitives(primitives);

      expect(restored.getId().toString()).toBe(brand.getId().toString());
      expect(restored.getName().toString()).toBe(brand.getName().toString());
      expect(restored.getSlug().toString()).toBe(brand.getSlug().toString());
      expect(restored.getStatus().toString()).toBe(brand.getStatus().toString());
      expect(restored.getVersion()).toBe(brand.getVersion());
    });
  });

  describe('event management', () => {
    it('should clear events', () => {
      const brand = Brand.create(validProps);
      expect(brand.getEvents()).toHaveLength(1);
      brand.clearEvents();
      expect(brand.getEvents()).toHaveLength(0);
    });

    it('should return copy of events', () => {
      const brand = Brand.create(validProps);
      const events = brand.getEvents();
      events.pop();
      expect(brand.getEvents()).toHaveLength(1);
    });
  });
});
