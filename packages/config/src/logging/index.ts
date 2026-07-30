import { getEnv } from '../validation';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogFormat = 'json' | 'pretty';

export interface LoggingConfig {
  readonly level: LogLevel;
  readonly format: LogFormat;
}

let cached: LoggingConfig | null = null;

export function loggingConfig(): LoggingConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    level: env.LOG_LEVEL,
    format: env.LOG_FORMAT,
  };

  return cached;
}

export function resetLoggingConfig(): void {
  cached = null;
}
