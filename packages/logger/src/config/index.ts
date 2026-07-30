import type { LoggerConfig } from '../types';

export function resolveConfig(overrides?: Partial<LoggerConfig>): LoggerConfig {
  const env = typeof process !== 'undefined' ? process.env : {};

  return {
    level: (env['LOG_LEVEL'] as LoggerConfig['level']) ?? 'info',
    prettyPrint: env['LOG_FORMAT'] === 'pretty' || env['NODE_ENV'] !== 'production',
    enabled: true,
    ...overrides,
  };
}
