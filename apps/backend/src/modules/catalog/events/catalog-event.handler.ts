import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class CatalogEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleCategoryCreated(event: { categoryId: string; tenantId: string; name: string; slug: string }): void {
    this.logger.info(
      { event: 'catalog.event.category_created', categoryId: event.categoryId, tenantId: event.tenantId, name: event.name },
      'Category created event',
    );
  }

  handleCategoryActivated(event: { categoryId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.category_activated', categoryId: event.categoryId, tenantId: event.tenantId },
      'Category activated event',
    );
  }

  handleCategoryDeactivated(event: { categoryId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.category_deactivated', categoryId: event.categoryId, tenantId: event.tenantId },
      'Category deactivated event',
    );
  }

  handleCategoryArchived(event: { categoryId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.category_archived', categoryId: event.categoryId, tenantId: event.tenantId },
      'Category archived event',
    );
  }

  handleCategoryRestored(event: { categoryId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.category_restored', categoryId: event.categoryId, tenantId: event.tenantId },
      'Category restored event',
    );
  }

  handleCategoryDeleted(event: { categoryId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.category_deleted', categoryId: event.categoryId, tenantId: event.tenantId },
      'Category deleted event',
    );
  }

  handleCollectionCreated(event: { collectionId: string; tenantId: string; name: string; slug: string }): void {
    this.logger.info(
      { event: 'catalog.event.collection_created', collectionId: event.collectionId, tenantId: event.tenantId, name: event.name },
      'Collection created event',
    );
  }

  handleCollectionActivated(event: { collectionId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.collection_activated', collectionId: event.collectionId, tenantId: event.tenantId },
      'Collection activated event',
    );
  }

  handleCollectionDeactivated(event: { collectionId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.collection_deactivated', collectionId: event.collectionId, tenantId: event.tenantId },
      'Collection deactivated event',
    );
  }

  handleCollectionArchived(event: { collectionId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.collection_archived', collectionId: event.collectionId, tenantId: event.tenantId },
      'Collection archived event',
    );
  }

  handleCollectionRestored(event: { collectionId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.collection_restored', collectionId: event.collectionId, tenantId: event.tenantId },
      'Collection restored event',
    );
  }

  handleCollectionDeleted(event: { collectionId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'catalog.event.collection_deleted', collectionId: event.collectionId, tenantId: event.tenantId },
      'Collection deleted event',
    );
  }
}
