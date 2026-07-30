import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class BrandEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleBrandCreated(event: { brandId: string; tenantId: string; name: string; slug: string }): void {
    this.logger.info(
      { event: 'brands.event.brand_created', brandId: event.brandId, tenantId: event.tenantId, name: event.name },
      'Brand created event',
    );
  }

  handleBrandActivated(event: { brandId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'brands.event.brand_activated', brandId: event.brandId, tenantId: event.tenantId },
      'Brand activated event',
    );
  }

  handleBrandDeactivated(event: { brandId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'brands.event.brand_deactivated', brandId: event.brandId, tenantId: event.tenantId },
      'Brand deactivated event',
    );
  }

  handleBrandArchived(event: { brandId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'brands.event.brand_archived', brandId: event.brandId, tenantId: event.tenantId },
      'Brand archived event',
    );
  }

  handleBrandRestored(event: { brandId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'brands.event.brand_restored', brandId: event.brandId, tenantId: event.tenantId },
      'Brand restored event',
    );
  }

  handleBrandDeleted(event: { brandId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'brands.event.brand_deleted', brandId: event.brandId, tenantId: event.tenantId },
      'Brand deleted event',
    );
  }
}
