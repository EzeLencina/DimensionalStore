import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class PricingEventHandler {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: any) {}

  handle(event: any): void {
    this.logger.info({ event: event.eventName, ...event }, 'Pricing domain event');
  }
}
