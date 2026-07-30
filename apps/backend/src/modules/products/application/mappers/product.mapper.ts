import type { Product, ProductPrimitives } from '../../domain';
import type { ProductResponseDto, ProductListResponseDto } from '../dto';
import type { ProductListResult } from '../../domain';

export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    const p = product.toPrimitives();
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: p.description,
      productType: p.productType,
      status: p.status,
      visibility: p.visibility,
      condition: p.condition,
      warrantyMonths: p.warrantyMonths,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      deletedAt: p.deletedAt?.toISOString() ?? null,
      version: p.version,
    };
  }

  static toListResponse(result: ProductListResult): ProductListResponseDto {
    return {
      items: result.items.map(ProductMapper.toResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
