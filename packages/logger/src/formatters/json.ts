import type { LoggerOptions } from 'pino';

export function jsonFormatter(): Partial<LoggerOptions> {
  return {
    formatters: {
      level: (label) => ({ level: label }),
    },
    messageKey: 'msg',
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  };
}
