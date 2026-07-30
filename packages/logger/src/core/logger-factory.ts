import type { LoggerFactory, Logger, LoggerConfig } from '../types';
import { PinoLogger } from './pino-logger';
import { NoopLogger } from './noop-logger';
import { resolveConfig } from '../config';

export const createLogger: LoggerFactory = (overrides?) => {
  const config = resolveConfig(overrides);

  if (config.enabled === false) {
    return new NoopLogger();
  }

  return new PinoLogger({
    level: config.level,
    prettyPrint: config.prettyPrint,
    destination: config.destination,
    redact: config.redact,
    enabled: config.enabled,
  });
};
