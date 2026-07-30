// ──────────────────────────────────────────────
// Config — Single source of truth
// ──────────────────────────────────────────────

export { appConfig, resetAppConfig } from './app';
export type { AppConfig } from './app';

export { databaseConfig, resetDatabaseConfig } from './database';
export type { DatabaseConfig } from './database';

export { redisConfig, resetRedisConfig } from './redis';
export type { RedisConfig } from './redis';

export { jwtConfig, resetJwtConfig } from './jwt';
export type { JwtConfig } from './jwt';

export { cacheConfig, resetCacheConfig } from './cache';
export type { CacheConfig } from './cache';

export { queueConfig, resetQueueConfig } from './queue';
export type { QueueConfig } from './queue';

export { storageConfig, resetStorageConfig } from './storage';
export type { StorageConfig } from './storage';

export { mailConfig, resetMailConfig } from './mail';
export type { MailConfig } from './mail';

export { apiConfig, resetApiConfig } from './api';
export type { ApiConfig } from './api';

export { httpConfig, resetHttpConfig } from './http';
export type { HttpConfig } from './http';

export { securityConfig, resetSecurityConfig } from './security';
export type { SecurityConfig } from './security';

export { corsConfig, resetCorsConfig } from './cors';
export type { CorsConfig } from './cors';

export { rateLimitConfig, resetRateLimitConfig } from './rate-limit';
export type { RateLimitConfig } from './rate-limit';

export { loggingConfig, resetLoggingConfig } from './logging';
export type { LoggingConfig, LogLevel, LogFormat } from './logging';

export { analyticsConfig } from './analytics';
export type { AnalyticsConfig } from './analytics';

export { integrationsConfig } from './integrations';
export type { IntegrationConfig } from './integrations';

// ──────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────

export {
  envSchema,
  loadEnv,
  loadEnvSafe,
  getEnv,
  resetEnv,
  publicEnvSchema,
  loadPublicEnv,
} from './validation';
export type { Env, PublicEnv, ValidationResult } from './validation';
