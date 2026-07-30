import type { LoggerOptions } from 'pino';

export function prettyTransport(): LoggerOptions['transport'] {
  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      messageKey: 'msg',
      singleLine: false,
    },
  };
}
