import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { Product, ProductException, PRODUCT_ERROR_CODES } from '../../domain';
import type { IProductRepository, ProductListParams, ProductListResult } from '../../domain';
import { PrismaProductMapper } from './prisma-product.mapper';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async save(product: Product): Promise<void> {
    const p = product.toPrimitives();
    const existing = await this.prisma.product.findUnique({
      where: { id: p.id },
    });

    if (existing) {
      if (existing.version !== p.version) {
        throw new ProductException(
          PRODUCT_ERROR_CODES.PRODUCT_VERSION_CONFLICT,
          `Product version conflict: expected version ${p.version}, found ${existing.version}`,
        );
      }
      await this.prisma.product.update({
        where: { id: p.id },
        data: PrismaProductMapper.toUpdateInput(product),
      });
    } else {
      await this.prisma.product.create({
        data: PrismaProductMapper.toCreateInput(product),
      });
    }

    this.logger.debug(
      { event: 'products.repository.saved', productId: p.id, version: p.version },
      'Product persisted',
    );
  }

  async findById(id: string, tenantId: string): Promise<Product | null> {
    const model = await this.prisma.product.findFirst({
      where: { id, tenantId },
    });
    return model ? PrismaProductMapper.toDomain(model) : null;
  }

  async findBySlug(slug: string, tenantId: string): Promise<Product | null> {
    const model = await this.prisma.product.findFirst({
      where: { slug, tenantId },
    });
    return model ? PrismaProductMapper.toDomain(model) : null;
  }

  async existsBySlug(slug: string, tenantId: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { slug, tenantId },
    });
    return count > 0;
  }

  async list(params: ProductListParams): Promise<ProductListResult> {
    const { tenantId, status, visibility, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const where: any = { tenantId };

    if (status && status.length > 0) {
      where.status = { in: status };
    }
    if (visibility && visibility.length > 0) {
      where.visibility = { in: visibility };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map(PrismaProductMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.prisma.product.deleteMany({
      where: { id, tenantId },
    });
  }
}
