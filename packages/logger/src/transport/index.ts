import type { LoggerOptions } from 'pino';
import { prettyTransport } from '../formatters/pretty';

export function resolveTransport(pretty: boolean): Partial<LoggerOptions> {
  if (pretty) {
    return { transport: prettyTransport() };
  }
  return {};
}
