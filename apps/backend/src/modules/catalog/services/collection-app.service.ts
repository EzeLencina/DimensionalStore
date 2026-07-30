import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Collection, CollectionId } from '../domain';
import { CatalogException, CATALOG_ERROR_CODES } from '../domain/exceptions';
import { CollectionValidator } from '../application/validators';
import { CollectionMapper } from '../application/mappers';
import { COLLECTION_REPOSITORY } from '../domain/repository';
import type { CollectionRepository } from '../domain/repository';
import type { CollectionResponseDto } from '../application/dto/collection';
import type { CollectionListQueryDto, PaginatedCollectionResponseDto } from '../application/dto/collection';
import { CreateCollectionCommand } from '../application/commands/collection';
import type { UpdateCollectionCommand } from '../application/commands/collection';
import { Slug } from '../domain/value-objects';

@Injectable()
export class CollectionAppService {
  constructor(
    @Inject(COLLECTION_REPOSITORY) private readonly repository: CollectionRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async create(tenantId: string, command: CreateCollectionCommand): Promise<CollectionResponseDto> {
    const slug = command.slug || Slug.fromName(command.name).getValue();
    const commandWithSlug = new CreateCollectionCommand(
      command.tenantId, command.name, slug,
      command.description, command.type, command.status,
      command.visibility, command.displayOrder,
      command.startAt, command.endAt,
      command.seoTitle, command.seoDescription,
    );

    const errors = CollectionValidator.validateCreate(commandWithSlug);
    if (errors.length > 0) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_INVALID_DATA, errors.join('; '));
    }

    const existingSlug = await this.repository.existsBySlug(tenantId, slug);
    if (existingSlug) {
      throw new CatalogException(
        CATALOG_ERROR_CODES.COLLECTION_SLUG_ALREADY_EXISTS,
        `Slug "${slug}" already exists in this tenant`,
      );
    }

    const type = command.type || 'MANUAL';
    const status = command.status || 'DRAFT';
    const visibility = command.visibility || 'PUBLIC';

    const collection = Collection.create({
      tenantId,
      name: command.name,
      slug,
      description: command.description ?? null,
      type: type as any,
      status: status as any,
      visibility: visibility as any,
      displayOrder: command.displayOrder ?? 0,
      startAt: command.startAt ? new Date(command.startAt) : null,
      endAt: command.endAt ? new Date(command.endAt) : null,
      seoTitle: command.seoTitle ?? null,
      seoDescription: command.seoDescription ?? null,
    });

    await this.repository.save(collection);

    this.logger.info(
      { event: 'catalog.collection.created', collectionId: collection.getId().toString(), tenantId },
      'Collection created',
    );

    return CollectionMapper.toResponse(collection);
  }

  async findById(id: string, tenantId: string): Promise<CollectionResponseDto> {
    const collectionId = new CollectionId(id);
    const collection = await this.repository.findById(collectionId);
    if (!collection || collection.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_NOT_FOUND, 'Collection not found');
    }
    return CollectionMapper.toResponse(collection);
  }

  async findBySlug(slug: string, tenantId: string): Promise<CollectionResponseDto> {
    const collection = await this.repository.findBySlug(tenantId, slug);
    if (!collection) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_NOT_FOUND, 'Collection not found');
    }
    return CollectionMapper.toResponse(collection);
  }

  async findAll(
    tenantId: string,
    query: CollectionListQueryDto,
  ): Promise<PaginatedCollectionResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const result = await this.repository.findFiltered(
      {
        tenantId,
        status: query.status,
        visibility: query.visibility,
        type: query.type,
        search: query.search,
        activeOnly: query.activeOnly,
        includeDeleted: query.includeDeleted,
      },
      query.sortField
        ? { field: query.sortField as any, direction: (query.sortDirection as any) ?? 'asc' }
        : undefined,
      page,
      limit,
    );

    return CollectionMapper.toResponseList(result.data, result.total, page, limit);
  }

  async update(id: string, tenantId: string, command: UpdateCollectionCommand): Promise<CollectionResponseDto> {
    const errors = CollectionValidator.validateUpdate(command as any);
    if (errors.length > 0) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_INVALID_DATA, errors.join('; '));
    }

    const collectionId = new CollectionId(id);
    const collection = await this.repository.findById(collectionId);
    if (!collection || collection.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_NOT_FOUND, 'Collection not found');
    }

    if (command.name !== undefined) collection.rename(command.name);
    if (command.slug !== undefined) {
      const existingSlug = await this.repository.existsBySlug(tenantId, command.slug, id);
      if (existingSlug && collection.getSlug().toString() !== command.slug) {
        throw new CatalogException(
          CATALOG_ERROR_CODES.COLLECTION_SLUG_ALREADY_EXISTS,
          `Slug "${command.slug}" already exists in this tenant`,
        );
      }
      collection.changeSlug(command.slug);
    }
    if (command.description !== undefined) collection.updateDescription(command.description);
    if (command.type !== undefined) collection.changeType(command.type as any);
    if (command.displayOrder !== undefined) collection.updateDisplayOrder(command.displayOrder);
    if (command.startAt !== undefined || command.endAt !== undefined) {
      const startAt = command.startAt !== undefined ? (command.startAt ? new Date(command.startAt) : null) : collection.getStartAt();
      const endAt = command.endAt !== undefined ? (command.endAt ? new Date(command.endAt) : null) : collection.getEndAt();
      collection.updateDateRange(startAt, endAt);
    }
    if (command.seoTitle !== undefined || command.seoDescription !== undefined) {
      collection.updateSeo(command.seoTitle ?? null, command.seoDescription ?? null);
    }

    await this.repository.save(collection);

    this.logger.info(
      { event: 'catalog.collection.updated', collectionId: id, tenantId },
      'Collection updated',
    );

    return CollectionMapper.toResponse(collection);
  }

  async changeStatus(id: string, tenantId: string, status: string): Promise<CollectionResponseDto> {
    const collectionId = new CollectionId(id);
    const collection = await this.repository.findById(collectionId);
    if (!collection || collection.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_NOT_FOUND, 'Collection not found');
    }

    switch (status) {
      case 'ACTIVE':
        collection.activate();
        break;
      case 'INACTIVE':
        collection.deactivate();
        break;
      case 'ARCHIVED':
        collection.archive();
        break;
      default:
        throw new CatalogException(
          CATALOG_ERROR_CODES.COLLECTION_INVALID_STATUS_TRANSITION,
          `Invalid status: ${status}`,
        );
    }

    await this.repository.save(collection);
    return CollectionMapper.toResponse(collection);
  }

  async changeVisibility(id: string, tenantId: string, visibility: string): Promise<CollectionResponseDto> {
    const collectionId = new CollectionId(id);
    const collection = await this.repository.findById(collectionId);
    if (!collection || collection.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_NOT_FOUND, 'Collection not found');
    }

    collection.changeVisibility(visibility as any);
    await this.repository.save(collection);
    return CollectionMapper.toResponse(collection);
  }

  async archive(id: string, tenantId: string): Promise<CollectionResponseDto> {
    const collectionId = new CollectionId(id);
    const collection = await this.repository.findById(collectionId);
    if (!collection || collection.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_NOT_FOUND, 'Collection not found');
    }

    collection.archive();
    await this.repository.save(collection);

    this.logger.info(
      { event: 'catalog.collection.archived', collectionId: id, tenantId },
      'Collection archived',
    );

    return CollectionMapper.toResponse(collection);
  }

  async restore(id: string, tenantId: string): Promise<CollectionResponseDto> {
    const collectionId = new CollectionId(id);
    const collection = await this.repository.findById(collectionId);
    if (!collection || collection.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_NOT_FOUND, 'Collection not found');
    }

    collection.restore();
    await this.repository.save(collection);
    return CollectionMapper.toResponse(collection);
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    const collectionId = new CollectionId(id);
    const collection = await this.repository.findById(collectionId);
    if (!collection || collection.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.COLLECTION_NOT_FOUND, 'Collection not found');
    }

    collection.softDelete();
    await this.repository.save(collection);

    this.logger.info(
      { event: 'catalog.collection.deleted', collectionId: id, tenantId },
      'Collection soft deleted',
    );
  }
}
