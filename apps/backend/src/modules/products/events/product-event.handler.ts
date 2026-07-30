import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class ProductEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleProductCreated(event: { productId: string; tenantId: string; name: string; slug: string }): void {
    this.logger.info(
      { event: 'products.event.product_created', productId: event.productId, tenantId: event.tenantId, name: event.name, slug: event.slug },
      'Product created event',
    );
  }

  handleProductActivated(event: { productId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'products.event.product_activated', productId: event.productId, tenantId: event.tenantId },
      'Product activated event',
    );
  }

  handleProductDeactivated(event: { productId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'products.event.product_deactivated', productId: event.productId, tenantId: event.tenantId },
      'Product deactivated event',
    );
  }

  handleProductArchived(event: { productId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'products.event.product_archived', productId: event.productId, tenantId: event.tenantId },
      'Product archived event',
    );
  }

  handleProductRestored(event: { productId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'products.event.product_restored', productId: event.productId, tenantId: event.tenantId },
      'Product restored event',
    );
  }

  handleProductDeleted(event: { productId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'products.event.product_deleted', productId: event.productId, tenantId: event.tenantId },
      'Product deleted event',
    );
  }
}
