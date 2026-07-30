import type { PrismaClient, Prisma } from '@tienda/database';
import { Category, type CategoryPrimitives } from '../../../../domain';

export type CategoryPrismaModel = Prisma.CategoryGetPayload<{}>;

export class PrismaCategoryMapper {
  static toDomain(model: CategoryPrismaModel): Category {
    return Category.fromPrimitives({
      id: model.id,
      tenantId: model.tenantId,
      parentId: model.parentId,
      name: model.name,
      slug: model.slug,
      description: model.description,
      shortDescription: model.shortDescription,
      status: model.status as any,
      visibility: model.visibility as any,
      displayOrder: model.displayOrder,
      icon: model.icon,
      image: model.image,
      seoTitle: model.seoTitle,
      seoDescription: model.seoDescription,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
      version: model.version,
    } as CategoryPrimitives);
  }

  static toCreateInput(category: Category): Prisma.CategoryCreateInput {
    const p = category.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      parent: p.parentId ? { connect: { id: p.parentId } } : undefined,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription,
      status: p.status as any,
      visibility: p.visibility as any,
      displayOrder: p.displayOrder,
      icon: p.icon,
      image: p.image,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: p.createdAt,
    };
  }

  static toUpdateInput(category: Category): Prisma.CategoryUpdateInput {
    const p = category.toPrimitives();
    return {
      parent: p.parentId === null
        ? { disconnect: true }
        : p.parentId
          ? { connect: { id: p.parentId } }
          : undefined,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription,
      status: p.status as any,
      visibility: p.visibility as any,
      displayOrder: p.displayOrder,
      icon: p.icon,
      image: p.image,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      updatedAt: p.updatedAt,
      version: p.version,
    };
  }
}
