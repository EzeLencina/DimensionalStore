import type { Collection, CollectionPrimitives } from '../../domain';
import type { CollectionResponseDto } from '../dto/collection';

export class CollectionMapper {
  static toResponse(collection: Collection): CollectionResponseDto {
    const p = collection.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      name: p.name,
      slug: p.slug,
      description: p.description,
      type: p.type,
      status: p.status,
      visibility: p.visibility,
      displayOrder: p.displayOrder,
      startAt: p.startAt?.toISOString() ?? null,
      endAt: p.endAt?.toISOString() ?? null,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      deletedAt: p.deletedAt?.toISOString() ?? null,
      version: p.version,
    };
  }

  static toResponseList(collections: Collection[], total: number, page: number, limit: number) {
    return {
      data: collections.map(CollectionMapper.toResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
