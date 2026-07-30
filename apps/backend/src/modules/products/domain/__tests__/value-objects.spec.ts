import { ProductName } from '../value-objects/product-name.vo';
import { ProductSlug } from '../value-objects/product-slug.vo';
import { ShortDescription } from '../value-objects/short-description.vo';
import { ProductDescription } from '../value-objects/product-description.vo';
import { SeoTitle } from '../value-objects/seo-title.vo';
import { SeoDescription } from '../value-objects/seo-description.vo';
import { WarrantyPeriod } from '../value-objects/warranty-period.vo';
import { ProductStatus } from '../value-objects/product-status.vo';
import { ProductVisibility } from '../value-objects/product-visibility.vo';
import { ProductCondition } from '../value-objects/product-condition.vo';
import { ProductType } from '../value-objects/product-type.vo';
import { ProductId } from '../value-objects/product-id.vo';

describe('ProductId', () => {
  it('should generate a random UUID', () => {
    const id = new ProductId();
    expect(id.getValue()).toBeDefined();
  });

  it('should accept a custom value', () => {
    const id = new ProductId('custom-id');
    expect(id.getValue()).toBe('custom-id');
  });

  it('should throw on empty string', () => {
    expect(() => new ProductId('')).toThrow();
  });

  it('should implement equality', () => {
    const id1 = new ProductId('abc');
    const id2 = new ProductId('abc');
    const id3 = new ProductId('def');
    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});

describe('ProductName', () => {
  it('should create valid name', () => {
    const name = new ProductName('Smart Lock Pro');
    expect(name.getValue()).toBe('Smart Lock Pro');
  });

  it('should normalize spaces', () => {
    const name = new ProductName('  Smart   Lock  Pro  ');
    expect(name.getValue()).toBe('Smart Lock Pro');
  });

  it('should throw on empty string', () => {
    expect(() => new ProductName('')).toThrow();
  });

  it('should throw on too short name', () => {
    expect(() => new ProductName('A')).toThrow();
  });

  it('should implement equality', () => {
    expect(new ProductName('Lock').equals(new ProductName('Lock'))).toBe(true);
    expect(new ProductName('Lock').equals(new ProductName('Door'))).toBe(false);
  });
});

describe('ProductSlug', () => {
  it('should create valid slug', () => {
    const slug = new ProductSlug('smart-lock-pro');
    expect(slug.getValue()).toBe('smart-lock-pro');
  });

  it('should normalize to lowercase', () => {
    const slug = new ProductSlug('Smart-Lock-Pro');
    expect(slug.getValue()).toBe('smart-lock-pro');
  });

  it('should throw on invalid characters', () => {
    expect(() => new ProductSlug('Smart Lock!')).toThrow();
    expect(() => new ProductSlug('smart_lock')).toThrow();
    expect(() => new ProductSlug('')).toThrow();
  });

  it('should throw on leading/trailing hyphens', () => {
    expect(() => new ProductSlug('-smart-lock')).toThrow();
    expect(() => new ProductSlug('smart-lock-')).toThrow();
  });
});

describe('ShortDescription', () => {
  it('should create valid short description', () => {
    const desc = new ShortDescription('A great product');
    expect(desc.getValue()).toBe('A great product');
  });

  it('should handle null', () => {
    const desc = new ShortDescription(null);
    expect(desc.getValue()).toBeNull();
  });

  it('should handle undefined', () => {
    const desc = new ShortDescription(undefined);
    expect(desc.getValue()).toBeNull();
  });

  it('should throw on too long', () => {
    expect(() => new ShortDescription('x'.repeat(501))).toThrow();
  });
});

describe('ProductDescription', () => {
  it('should create valid description', () => {
    const desc = new ProductDescription('Full product description');
    expect(desc.getValue()).toBe('Full product description');
  });

  it('should handle null', () => {
    expect(new ProductDescription(null).getValue()).toBeNull();
  });
});

describe('SeoTitle', () => {
  it('should create valid SEO title', () => {
    const title = new SeoTitle('Smart Lock Pro | Tienda');
    expect(title.getValue()).toBe('Smart Lock Pro | Tienda');
  });

  it('should handle null', () => {
    expect(new SeoTitle(null).getValue()).toBeNull();
  });

  it('should throw on too long', () => {
    expect(() => new SeoTitle('x'.repeat(71))).toThrow();
  });
});

describe('SeoDescription', () => {
  it('should create valid SEO description', () => {
    const desc = new SeoDescription('Best smart lock on the market');
    expect(desc.getValue()).toBe('Best smart lock on the market');
  });

  it('should handle null', () => {
    expect(new SeoDescription(null).getValue()).toBeNull();
  });

  it('should throw on too long', () => {
    expect(() => new SeoDescription('x'.repeat(161))).toThrow();
  });
});

describe('WarrantyPeriod', () => {
  it('should create valid warranty', () => {
    const w = new WarrantyPeriod(12);
    expect(w.getValue()).toBe(12);
  });

  it('should handle null', () => {
    expect(new WarrantyPeriod(null).getValue()).toBeNull();
  });

  it('should throw on negative', () => {
    expect(() => new WarrantyPeriod(-1)).toThrow();
  });

  it('should throw on too large', () => {
    expect(() => new WarrantyPeriod(121)).toThrow();
  });

  it('should implement equality', () => {
    expect(new WarrantyPeriod(12).equals(new WarrantyPeriod(12))).toBe(true);
  });
});

describe('ProductStatus', () => {
  it('should create valid statuses', () => {
    expect(ProductStatus.DRAFT.getValue()).toBe('DRAFT');
    expect(ProductStatus.ACTIVE.getValue()).toBe('ACTIVE');
    expect(ProductStatus.INACTIVE.getValue()).toBe('INACTIVE');
    expect(ProductStatus.ARCHIVED.getValue()).toBe('ARCHIVED');
  });

  it('should validate transitions', () => {
    expect(ProductStatus.DRAFT.canTransitionTo('ACTIVE')).toBe(true);
    expect(ProductStatus.DRAFT.canTransitionTo('ARCHIVED')).toBe(true);
    expect(ProductStatus.DRAFT.canTransitionTo('INACTIVE')).toBe(false);
    expect(ProductStatus.ACTIVE.canTransitionTo('INACTIVE')).toBe(true);
    expect(ProductStatus.ACTIVE.canTransitionTo('ARCHIVED')).toBe(true);
    expect(ProductStatus.ACTIVE.canTransitionTo('DRAFT')).toBe(false);
    expect(ProductStatus.ARCHIVED.canTransitionTo('DRAFT')).toBe(true);
    expect(ProductStatus.ARCHIVED.canTransitionTo('ACTIVE')).toBe(false);
  });

  it('should create from string', () => {
    expect(ProductStatus.fromString('active').getValue()).toBe('ACTIVE');
    expect(ProductStatus.fromString('DRAFT').getValue()).toBe('DRAFT');
  });

  it('should throw on invalid string', () => {
    expect(() => ProductStatus.fromString('INVALID')).toThrow();
  });
});

describe('ProductVisibility', () => {
  it('should create valid visibilities', () => {
    expect(ProductVisibility.PUBLIC.getValue()).toBe('PUBLIC');
    expect(ProductVisibility.PRIVATE.getValue()).toBe('PRIVATE');
    expect(ProductVisibility.HIDDEN.getValue()).toBe('HIDDEN');
  });

  it('should create from string', () => {
    expect(ProductVisibility.fromString('private').getValue()).toBe('PRIVATE');
  });

  it('should throw on invalid', () => {
    expect(() => ProductVisibility.fromString('INVALID')).toThrow();
  });
});

describe('ProductCondition', () => {
  it('should create valid conditions', () => {
    expect(ProductCondition.NEW.getValue()).toBe('NEW');
    expect(ProductCondition.REFURBISHED.getValue()).toBe('REFURBISHED');
    expect(ProductCondition.USED.getValue()).toBe('USED');
  });
});

describe('ProductType', () => {
  it('should create valid types', () => {
    expect(ProductType.PHYSICAL.getValue()).toBe('PHYSICAL');
    expect(ProductType.DIGITAL.getValue()).toBe('DIGITAL');
    expect(ProductType.SERVICE.getValue()).toBe('SERVICE');
    expect(ProductType.BUNDLE.getValue()).toBe('BUNDLE');
  });

  it('should detect physical type', () => {
    expect(ProductType.PHYSICAL.isPhysical()).toBe(true);
    expect(ProductType.DIGITAL.isPhysical()).toBe(false);
  });
});
