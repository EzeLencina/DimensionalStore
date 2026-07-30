import pino from 'pino';
import type { Logger, LogEntry, LogLevel } from '../types';
import { PINO_LEVELS } from '../constants';
import { createPinoOptions } from './pino-options';

export class PinoLogger implements Logger {
  private readonly pino: pino.Logger;

  constructor(
    options?: Partial<{
      level: LogLevel;
      prettyPrint: boolean;
      destination?: string;
      redact: string[];
      base: Record<string, unknown>;
      enabled: boolean;
    }>,
  ) {
    this.pino = pino(createPinoOptions(options));
  }

  fatal(entry: Omit<LogEntry, 'level' | 'timestamp'>): void {
    this.write('fatal', entry);
  }

  error(entry: Omit<LogEntry, 'level' | 'timestamp'>): void {
    this.write('error', entry);
  }

  warn(entry: Omit<LogEntry, 'level' | 'timestamp'>): void {
    this.write('warn', entry);
  }

  info(entry: Omit<LogEntry, 'level' | 'timestamp'>): void {
    this.write('info', entry);
  }

  debug(entry: Omit<LogEntry, 'level' | 'timestamp'>): void {
    this.write('debug', entry);
  }

  trace(entry: Omit<LogEntry, 'level' | 'timestamp'>): void {
    this.write('trace', entry);
  }

  child(context: string): Logger;
  child(metadata: Record<string, unknown>): Logger;
  child(contextOrMeta: string | Record<string, unknown>): Logger {
    const bindings =
      typeof contextOrMeta === 'string'
        ? { context: contextOrMeta }
        : contextOrMeta;
    const child = new PinoLogger();
    Object.assign(child, { pino: this.pino.child(bindings) });
    return child;
  }

  private write(level: LogLevel, entry: Omit<LogEntry, 'level' | 'timestamp'>): void {
    const pinoLevel = PINO_LEVELS[level];

    const logObject: Record<string, unknown> = {};

    if (entry.context) logObject['context'] = entry.context;
    if (entry.requestId) logObject['requestId'] = entry.requestId;
    if (entry.correlationId) logObject['correlationId'] = entry.correlationId;
    if (entry.traceId) logObject['traceId'] = entry.traceId;
    if (entry.tenantId) logObject['tenantId'] = entry.tenantId;
    if (entry.userId) logObject['userId'] = entry.userId;
    if (entry.sessionId) logObject['sessionId'] = entry.sessionId;
    if (entry.ip) logObject['ip'] = entry.ip;
    if (entry.method) logObject['method'] = entry.method;
    if (entry.url) logObject['url'] = entry.url;
    if (entry.statusCode) logObject['statusCode'] = entry.statusCode;
    if (entry.duration) logObject['duration'] = entry.duration;
    if (entry.threshold) logObject['threshold'] = entry.threshold;
    if (entry.metadata) logObject['metadata'] = entry.metadata;
    if (entry.data) logObject['data'] = entry.data;
    if (entry.controller) logObject['controller'] = entry.controller;
    if (entry.handler) logObject['handler'] = entry.handler;

    if (entry.error) {
      logObject['err'] = this.serializeError(entry.error);
    }

    logObject['msg'] = entry.message;
    logObject['level'] = pinoLevel;

    this.pino[level](logObject);
  }

  private serializeError(error: Error): Record<string, unknown> {
    return {
      type: error.constructor.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    };
  }

  getPino(): pino.Logger {
    return this.pino;
  }
}
