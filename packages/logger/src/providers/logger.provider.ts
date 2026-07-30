import { Provider } from '@nestjs/common';
import { createLogger } from '../core/logger-factory';
import { LOGGER_TOKEN } from './logger.token';

export const loggerProvider: Provider = {
  provide: LOGGER_TOKEN,
  useFactory: () => {
    const env = process.env;
    return createLogger({
      level: (env['LOG_LEVEL'] as any) ?? 'info',
      prettyPrint: env['LOG_FORMAT'] === 'pretty' || env['NODE_ENV'] !== 'production',
    });
  },
};
