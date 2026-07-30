import type { PrismaClient, Prisma } from '@tienda/database';
import { Product, type ProductPrimitives } from '../../domain';

export type ProductPrismaModel = Prisma.ProductGetPayload<{}>;

export class PrismaProductMapper {
  static toDomain(model: ProductPrismaModel): Product {
    return Product.fromPrimitives({
      id: model.id,
      tenantId: model.tenantId,
      organizationId: model.organizationId,
      name: model.name,
      slug: model.slug,
      shortDescription: model.shortDescription,
      description: model.description,
      productType: model.productType,
      status: model.status,
      visibility: model.visibility,
      condition: model.condition,
      warrantyMonths: model.warrantyMonths,
      seoTitle: model.seoTitle,
      seoDescription: model.seoDescription,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
      version: model.version,
    } as ProductPrimitives);
  }

  static toCreateInput(product: Product): Prisma.ProductCreateInput {
    const p = product.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      organizationId: p.organizationId,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: p.description,
      productType: p.productType as any,
      status: p.status as any,
      visibility: p.visibility as any,
      condition: p.condition as any,
      warrantyMonths: p.warrantyMonths,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: p.createdAt,
    };
  }

  static toUpdateInput(product: Product): Prisma.ProductUpdateInput {
    const p = product.toPrimitives();
    return {
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: p.description,
      productType: p.productType as any,
      status: p.status as any,
      visibility: p.visibility as any,
      condition: p.condition as any,
      warrantyMonths: p.warrantyMonths,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      updatedAt: p.updatedAt,
      version: p.version,
    };
  }
}
