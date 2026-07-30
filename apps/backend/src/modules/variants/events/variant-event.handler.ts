import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class VariantEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleVariantCreated(event: { variantId: string; tenantId: string; productId: string; sku: string }): void {
    this.logger.info(
      { event: 'variants.event.variant_created', ...event },
      'Variant created event',
    );
  }

  handleVariantActivated(event: { variantId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'variants.event.variant_activated', ...event },
      'Variant activated event',
    );
  }

  handleVariantDeactivated(event: { variantId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'variants.event.variant_deactivated', ...event },
      'Variant deactivated event',
    );
  }

  handleVariantArchived(event: { variantId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'variants.event.variant_archived', ...event },
      'Variant archived event',
    );
  }

  handleVariantRestored(event: { variantId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'variants.event.variant_restored', ...event },
      'Variant restored event',
    );
  }

  handleVariantDeleted(event: { variantId: string; tenantId: string }): void {
    this.logger.info(
      { event: 'variants.event.variant_deleted', ...event },
      'Variant deleted event',
    );
  }
}
