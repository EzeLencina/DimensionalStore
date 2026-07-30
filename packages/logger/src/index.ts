// ──────────────────────────────────────────────
// @tienda/logger — Logging system
// ──────────────────────────────────────────────

export { createLogger, PinoLogger, NoopLogger } from './core';
export { resolveConfig } from './config';
export { serializeError, serializeRequest, serializeResponse, redactSensitive } from './serializers';
export type { SerializedRequest, SerializedResponse } from './serializers';
export { prettyTransport, jsonFormatter } from './formatters';
export { resolveTransport } from './transport';
export { getCorrelationId, getRequestId, requestLoggerMiddleware, correlationMiddleware } from './middleware';
export type { RequestLogOptions } from './middleware';
export { redactDeep, isSensitiveKey, sanitizeLogInput } from './utils';
export { SENSITIVE_KEYS, LOG_LEVELS, PINO_LEVELS } from './constants';
export { LOGGER_TOKEN, LoggerModule, loggerProvider } from './providers';
export { LoggingInterceptor, PerformanceInterceptor } from './interceptors';

export type { Logger, LogEntry, LogLevel, LoggerConfig, LoggerFactory } from './types';
