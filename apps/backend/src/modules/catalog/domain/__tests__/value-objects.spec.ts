import { CategoryId } from '../value-objects/category-id';
import { CategoryName } from '../value-objects/category-name';
import { CollectionId } from '../value-objects/collection-id';
import { Slug } from '../value-objects/slug';
import { Description } from '../value-objects/description';
import { ShortDescription } from '../value-objects/short-description';
import { DisplayOrder } from '../value-objects/display-order';
import { Url } from '../value-objects/url';
import { SeoTitle } from '../value-objects/seo-title';
import { SeoDescription } from '../value-objects/seo-description';
import { CatalogStatus } from '../value-objects/catalog-status';
import { CatalogVisibility } from '../value-objects/catalog-visibility';
import { CollectionType } from '../value-objects/collection-type';

describe('CategoryId', () => {
  it('should generate a random UUID', () => {
    const id = new CategoryId();
    expect(id.getValue()).toBeDefined();
  });

  it('should accept a custom value', () => {
    const id = new CategoryId('custom-id');
    expect(id.getValue()).toBe('custom-id');
  });

  it('should throw on empty string', () => {
    expect(() => new CategoryId('')).toThrow();
  });

  it('should implement equality', () => {
    const id1 = new CategoryId('abc');
    const id2 = new CategoryId('abc');
    const id3 = new CategoryId('def');
    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});

describe('CategoryName', () => {
  it('should create valid name', () => {
    const name = CategoryName.create('Electronics');
    expect(name.getValue()).toBe('Electronics');
  });

  it('should trim whitespace', () => {
    const name = CategoryName.create('  Electronics  ');
    expect(name.getValue()).toBe('Electronics');
  });

  it('should throw on empty string', () => {
    expect(() => CategoryName.create('')).toThrow();
  });

  it('should throw on name exceeding 150 characters', () => {
    expect(() => CategoryName.create('a'.repeat(151))).toThrow();
  });

  it('should implement equality', () => {
    const n1 = CategoryName.create('Test');
    const n2 = CategoryName.create('Test');
    expect(n1.equals(n2)).toBe(true);
  });
});

describe('CollectionId', () => {
  it('should generate a random UUID', () => {
    const id = new CollectionId();
    expect(id.getValue()).toBeDefined();
  });

  it('should accept a custom value', () => {
    const id = new CollectionId('custom-id');
    expect(id.getValue()).toBe('custom-id');
  });

  it('should throw on empty string', () => {
    expect(() => new CollectionId('')).toThrow();
  });
});

describe('Slug', () => {
  it('should create valid slug', () => {
    const slug = Slug.create('electronics');
    expect(slug.getValue()).toBe('electronics');
  });

  it('should accept hyphens', () => {
    const slug = Slug.create('smart-lock-pro');
    expect(slug.getValue()).toBe('smart-lock-pro');
  });

  it('should lowercase uppercase input', () => {
    const slug = Slug.create('Electronics');
    expect(slug.getValue()).toBe('electronics');
  });

  it('should reject slug with uppercase after creation if validation is strict', () => {
    expect(() => Slug.create('Invalid Slug!')).toThrow();
  });

  it('should reject special characters', () => {
    expect(() => Slug.create('hello world!')).toThrow();
  });

  it('should reject empty slug', () => {
    expect(() => Slug.create('')).toThrow();
  });

  it('should reject slug exceeding 200 characters', () => {
    expect(() => Slug.create('a'.repeat(201))).toThrow();
  });

  it('should create slug from name', () => {
    const slug = Slug.fromName('Smart Lock Pro');
    expect(slug.getValue()).toBe('smart-lock-pro');
  });

  it('should create slug from name with special chars', () => {
    const slug = Slug.fromName('Hello World! @#$');
    expect(slug.getValue()).toBe('hello-world');
  });
});

describe('Description', () => {
  it('should create description', () => {
    const desc = Description.create('A long description');
    expect(desc.getValue()).toBe('A long description');
  });

  it('should create empty description', () => {
    const desc = Description.create('');
    expect(desc.isEmpty()).toBe(true);
  });

  it('should throw on exceeding 5000 characters', () => {
    expect(() => Description.create('a'.repeat(5001))).toThrow();
  });
});

describe('ShortDescription', () => {
  it('should create short description', () => {
    const desc = ShortDescription.create('Short text');
    expect(desc.getValue()).toBe('Short text');
  });

  it('should create empty short description', () => {
    const desc = ShortDescription.create('');
    expect(desc.isEmpty()).toBe(true);
  });

  it('should throw on exceeding 500 characters', () => {
    expect(() => ShortDescription.create('a'.repeat(501))).toThrow();
  });
});

describe('DisplayOrder', () => {
  it('should create display order', () => {
    const order = DisplayOrder.create(5);
    expect(order.getValue()).toBe(5);
  });

  it('should create default display order', () => {
    const order = DisplayOrder.default();
    expect(order.getValue()).toBe(0);
  });

  it('should floor decimal values', () => {
    const order = DisplayOrder.create(5.7);
    expect(order.getValue()).toBe(5);
  });

  it('should throw on negative value', () => {
    expect(() => DisplayOrder.create(-1)).toThrow();
  });

  it('should throw on value exceeding 999999', () => {
    expect(() => DisplayOrder.create(1000000)).toThrow();
  });
});

describe('Url', () => {
  it('should create valid url', () => {
    const url = Url.create('https://example.com/image.jpg');
    expect(url.getValue()).toBe('https://example.com/image.jpg');
  });

  it('should create empty url', () => {
    const url = Url.empty();
    expect(url.isEmpty()).toBe(true);
  });

  it('should throw on empty string', () => {
    expect(() => Url.create('')).toThrow();
  });
});

describe('SeoTitle', () => {
  it('should create seo title', () => {
    const title = SeoTitle.create('My SEO Title');
    expect(title.getValue()).toBe('My SEO Title');
  });

  it('should create empty seo title', () => {
    const title = SeoTitle.empty();
    expect(title.isEmpty()).toBe(true);
  });

  it('should throw on exceeding 70 characters', () => {
    expect(() => SeoTitle.create('a'.repeat(71))).toThrow();
  });
});

describe('SeoDescription', () => {
  it('should create seo description', () => {
    const desc = SeoDescription.create('My SEO description');
    expect(desc.getValue()).toBe('My SEO description');
  });

  it('should create empty seo description', () => {
    const desc = SeoDescription.empty();
    expect(desc.isEmpty()).toBe(true);
  });

  it('should throw on exceeding 160 characters', () => {
    expect(() => SeoDescription.create('a'.repeat(161))).toThrow();
  });
});

describe('CatalogStatus', () => {
  it('should create from string', () => {
    const status = CatalogStatus.create('ACTIVE');
    expect(status.getValue()).toBe('ACTIVE');
  });

  it('should be case insensitive', () => {
    const status = CatalogStatus.create('active');
    expect(status.getValue()).toBe('ACTIVE');
  });

  it('should create draft', () => {
    const status = CatalogStatus.draft();
    expect(status.isDraft()).toBe(true);
    expect(status.canActivate()).toBe(true);
  });

  it('should create active', () => {
    const status = CatalogStatus.active();
    expect(status.isActive()).toBe(true);
    expect(status.canArchive()).toBe(true);
  });

  it('should create inactive', () => {
    const status = CatalogStatus.inactive();
    expect(status.isInactive()).toBe(true);
    expect(status.canActivate()).toBe(true);
  });

  it('should create archived', () => {
    const status = CatalogStatus.archived();
    expect(status.isArchived()).toBe(true);
    expect(status.canArchive()).toBe(false);
    expect(status.canActivate()).toBe(false);
  });

  it('should throw on invalid status', () => {
    expect(() => CatalogStatus.create('INVALID')).toThrow();
  });
});

describe('CatalogVisibility', () => {
  it('should create from string', () => {
    const vis = CatalogVisibility.create('PUBLIC');
    expect(vis.getValue()).toBe('PUBLIC');
    expect(vis.isPublic()).toBe(true);
  });

  it('should create private', () => {
    const vis = CatalogVisibility.private();
    expect(vis.isPrivate()).toBe(true);
  });

  it('should create hidden', () => {
    const vis = CatalogVisibility.hidden();
    expect(vis.isHidden()).toBe(true);
  });

  it('should throw on invalid visibility', () => {
    expect(() => CatalogVisibility.create('INVALID')).toThrow();
  });
});

describe('CollectionType', () => {
  it('should create from string', () => {
    const type = CollectionType.create('MANUAL');
    expect(type.getValue()).toBe('MANUAL');
    expect(type.isManual()).toBe(true);
  });

  it('should create rule based', () => {
    const type = CollectionType.ruleBased();
    expect(type.getValue()).toBe('RULE_BASED');
  });

  it('should create featured', () => {
    const type = CollectionType.featured();
    expect(type.getValue()).toBe('FEATURED');
  });

  it('should create temporary', () => {
    const type = CollectionType.temporary();
    expect(type.getValue()).toBe('TEMPORARY');
  });

  it('should throw on invalid type', () => {
    expect(() => CollectionType.create('INVALID')).toThrow();
  });
});
