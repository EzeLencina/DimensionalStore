import type { Prisma } from '@tienda/database';
import { Brand, type BrandPrimitives } from '../../../../domain';

export type BrandPrismaModel = Prisma.BrandGetPayload<{}>;

export class PrismaBrandMapper {
  static toDomain(model: BrandPrismaModel): Brand {
    return Brand.fromPrimitives({
      id: model.id,
      tenantId: model.tenantId,
      name: model.name,
      slug: model.slug,
      description: model.description,
      logoUrl: model.logoUrl,
      websiteUrl: model.websiteUrl,
      status: model.status as any,
      visibility: model.visibility as any,
      seoTitle: model.seoTitle,
      seoDescription: model.seoDescription,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
      version: model.version,
    } as BrandPrimitives);
  }

  static toCreateInput(brand: Brand): Prisma.BrandCreateInput {
    const p = brand.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      name: p.name,
      slug: p.slug,
      description: p.description,
      logoUrl: p.logoUrl,
      websiteUrl: p.websiteUrl,
      status: p.status as any,
      visibility: p.visibility as any,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: p.createdAt,
    };
  }

  static toUpdateInput(brand: Brand): Prisma.BrandUpdateInput {
    const p = brand.toPrimitives();
    return {
      name: p.name,
      slug: p.slug,
      description: p.description,
      logoUrl: p.logoUrl,
      websiteUrl: p.websiteUrl,
      status: p.status as any,
      visibility: p.visibility as any,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      updatedAt: p.updatedAt,
      version: p.version,
    };
  }
}
