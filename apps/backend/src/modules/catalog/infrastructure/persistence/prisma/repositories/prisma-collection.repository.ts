import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { Collection, CollectionId, CatalogException, CATALOG_ERROR_CODES } from '../../../../domain';
import type { CollectionRepository } from '../../../../domain/repository';
import type { CollectionFilter, CollectionSort, PaginatedResult } from '../../../../domain/specifics';
import { PrismaCollectionMapper } from '../mappers/prisma-collection.mapper';

@Injectable()
export class PrismaCollectionRepository implements CollectionRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async findById(id: CollectionId): Promise<Collection | null> {
    const model = await this.prisma.collection.findUnique({
      where: { id: id.getValue() },
    });
    return model ? PrismaCollectionMapper.toDomain(model) : null;
  }

  async findBySlug(tenantId: string, slug: string): Promise<Collection | null> {
    const model = await this.prisma.collection.findFirst({
      where: { slug, tenantId },
    });
    return model ? PrismaCollectionMapper.toDomain(model) : null;
  }

  async findByTenant(tenantId: string): Promise<Collection[]> {
    const models = await this.prisma.collection.findMany({
      where: { tenantId },
      orderBy: { displayOrder: 'asc' },
    });
    return models.map(PrismaCollectionMapper.toDomain);
  }

  async findActiveByTenant(tenantId: string): Promise<Collection[]> {
    const now = new Date();
    const models = await this.prisma.collection.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
        OR: [
          { startAt: null },
          { startAt: { lte: now } },
        ],
        AND: [
          { OR: [
            { endAt: null },
            { endAt: { gte: now } },
          ]},
        ],
      },
      orderBy: { displayOrder: 'asc' },
    });
    return models.map(PrismaCollectionMapper.toDomain);
  }

  async findFiltered(
    filter: CollectionFilter,
    sort?: CollectionSort,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Collection>> {
    const where: any = { tenantId: filter.tenantId };

    if (!filter.includeDeleted) {
      where.deletedAt = null;
    }
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.visibility) {
      where.visibility = filter.visibility;
    }
    if (filter.type) {
      where.type = filter.type;
    }
    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { slug: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sort) {
      orderBy[sort.field] = sort.direction;
    } else {
      orderBy.displayOrder = 'asc';
    }

    const [items, total] = await Promise.all([
      this.prisma.collection.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.collection.count({ where }),
    ]);

    return {
      data: items.map(PrismaCollectionMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async existsBySlug(tenantId: string, slug: string, excludeId?: string): Promise<boolean> {
    const where: any = { slug, tenantId };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const count = await this.prisma.collection.count({ where });
    return count > 0;
  }

  async save(collection: Collection): Promise<Collection> {
    const p = collection.toPrimitives();
    const existing = await this.prisma.collection.findUnique({
      where: { id: p.id },
    });

    if (existing) {
      if (existing.version !== p.version) {
        throw new CatalogException(
          CATALOG_ERROR_CODES.COLLECTION_VERSION_CONFLICT,
          `Version conflict: expected ${p.version}, found ${existing.version}`,
        );
      }
      await this.prisma.collection.update({
        where: { id: p.id },
        data: {
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
          deletedAt: p.deletedAt,
          updatedAt: p.updatedAt,
          version: p.version,
        },
      });
    } else {
      await this.prisma.collection.create({
        data: PrismaCollectionMapper.toCreateInput(collection),
      });
    }

    this.logger.debug(
      { event: 'catalog.repository.collection.saved', collectionId: p.id, version: p.version },
      'Collection persisted',
    );

    const saved = await this.findById(new CollectionId(p.id));
    return saved!;
  }

  async delete(collectionId: CollectionId): Promise<void> {
    await this.prisma.collection.deleteMany({
      where: { id: collectionId.getValue() },
    });
  }
}
