import { ProductVariant } from '../../domain/aggregates/product-variant.aggregate';
import type { VariantResponseDto } from '../dto/variant-response.dto';
import type { PaginatedVariantResponseDto } from '../dto/variant-list-query.dto';

export class VariantMapper {
  static toResponse(variant: ProductVariant): VariantResponseDto {
    const p = variant.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      productId: p.productId,
      sku: p.sku,
      name: p.name,
      barcode: p.barcode,
      status: p.status,
      attributes: p.attributes,
      isDefault: p.isDefault,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      deletedAt: p.deletedAt?.toISOString() ?? null,
      version: p.version,
    };
  }

  static toResponseList(
    variants: ProductVariant[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedVariantResponseDto {
    return {
      data: variants.map(v => VariantMapper.toResponse(v)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
