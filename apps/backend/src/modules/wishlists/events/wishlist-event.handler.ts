import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class WishlistEventHandler {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: { info: (...args: unknown[]) => void }) {}
}
