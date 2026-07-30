import type { PrismaClient, Prisma } from '@tienda/database';
import { Collection, type CollectionPrimitives } from '../../../../domain';

export type CollectionPrismaModel = Prisma.CollectionGetPayload<{}>;

export class PrismaCollectionMapper {
  static toDomain(model: CollectionPrismaModel): Collection {
    return Collection.fromPrimitives({
      id: model.id,
      tenantId: model.tenantId,
      name: model.name,
      slug: model.slug,
      description: model.description,
      type: model.type as any,
      status: model.status as any,
      visibility: model.visibility as any,
      displayOrder: model.displayOrder,
      startAt: model.startAt,
      endAt: model.endAt,
      seoTitle: model.seoTitle,
      seoDescription: model.seoDescription,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
      version: model.version,
    } as CollectionPrimitives);
  }

  static toCreateInput(collection: Collection): Prisma.CollectionCreateInput {
    const p = collection.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      name: p.name,
      slug: p.slug,
      description: p.description,
      type: p.type as any,
      status: p.status as any,
      visibility: p.visibility as any,
      displayOrder: p.displayOrder,
      startAt: p.startAt,
      endAt: p.endAt,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: p.createdAt,
    };
  }

  static toUpdateInput(collection: Collection): Prisma.CollectionUpdateInput {
    const p = collection.toPrimitives();
    return {
      name: p.name,
      slug: p.slug,
      description: p.description,
      type: p.type as any,
      status: p.status as any,
      visibility: p.visibility as any,
      displayOrder: p.displayOrder,
      startAt: p.startAt,
      endAt: p.endAt,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      updatedAt: p.updatedAt,
      version: p.version,
    };
  }
}
