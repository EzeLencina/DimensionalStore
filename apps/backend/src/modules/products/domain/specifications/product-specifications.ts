import type { Product } from '../aggregates/product.aggregate';
import { ProductStatus } from '../value-objects';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class ProductIsActive implements ISpecification<Product> {
  isSatisfiedBy(product: Product): boolean {
    return product.isActive();
  }
}

export class ProductIsPublic implements ISpecification<Product> {
  isSatisfiedBy(product: Product): boolean {
    return product.isActive() && product.isPublic();
  }
}

export class ProductBelongsToTenant implements ISpecification<Product> {
  constructor(private readonly tenantId: string) {}

  isSatisfiedBy(product: Product): boolean {
    return product.getTenantId() === this.tenantId;
  }
}

export class ProductCanBePublished implements ISpecification<Product> {
  isSatisfiedBy(product: Product): boolean {
    if (product.getStatus().getValue() !== 'DRAFT' && product.getStatus().getValue() !== 'INACTIVE') return false;
    const name = product.getName().getValue();
    const slug = product.getSlug().getValue();
    return name.length > 0 && slug.length > 0;
  }
}

export class ProductCanBeArchived implements ISpecification<Product> {
  isSatisfiedBy(product: Product): boolean {
    return !product.isArchived();
  }
}
