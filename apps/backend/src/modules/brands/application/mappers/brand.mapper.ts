import type { Brand } from '../../domain';
import type { BrandResponseDto } from '../dto';

export class BrandMapper {
  static toResponse(brand: Brand): BrandResponseDto {
    const p = brand.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      name: p.name,
      slug: p.slug,
      description: p.description,
      logoUrl: p.logoUrl,
      websiteUrl: p.websiteUrl,
      status: p.status,
      visibility: p.visibility,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      deletedAt: p.deletedAt?.toISOString() ?? null,
      version: p.version,
    };
  }

  static toResponseList(brands: Brand[], total: number, page: number, limit: number) {
    return {
      data: brands.map(BrandMapper.toResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
