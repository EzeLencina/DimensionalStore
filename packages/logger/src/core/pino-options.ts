import type { LoggerOptions } from 'pino';

export function createPinoOptions(
  options?: Partial<{
    level: string;
    prettyPrint: boolean;
    destination?: string;
    redact: string[];
    base: Record<string, unknown>;
    enabled: boolean;
  }>,
): LoggerOptions {
  const level = options?.level ?? 'info';
  const pretty = options?.prettyPrint ?? true;
  const base = options?.base ?? { service: 'tienda' };
  const enabled = options?.enabled ?? true;

  const pinoOptions: LoggerOptions = {
    level,
    base,
    enabled,
    formatters: {
      level: (label) => ({ level: label }),
      bindings: (bindings) => bindings as Record<string, unknown>,
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    redact: options?.redact ?? {
      paths: [
        'password',
        'secret',
        'token',
        'authorization',
        'cookie',
        'jwt',
        'refreshToken',
        'apiKey',
      ],
      censor: '[REDACTED]',
    },
  };

  if (pretty) {
    pinoOptions.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        messageKey: 'msg',
      },
    };
  }

  return pinoOptions;
}
