import type { Category, CategoryPrimitives } from '../../domain';
import type { CategoryResponseDto } from '../dto/category';

export class CategoryMapper {
  static toResponse(category: Category): CategoryResponseDto {
    const p = category.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      parentId: p.parentId,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription,
      status: p.status,
      visibility: p.visibility,
      displayOrder: p.displayOrder,
      icon: p.icon,
      image: p.image,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      deletedAt: p.deletedAt?.toISOString() ?? null,
      version: p.version,
    };
  }

  static toResponseList(categories: Category[], total: number, page: number, limit: number) {
    return {
      data: categories.map(CategoryMapper.toResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
