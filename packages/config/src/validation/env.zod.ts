import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default('api/v1'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/tienda'),
  DATABASE_URL_DIRECT: z.string().url().optional(),
  SHADOW_DATABASE_URL: z.string().url().optional(),
  DATABASE_URL_REPLICA: z.string().url().optional(),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
  DATABASE_SSL: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  DATABASE_QUERY_TIMEOUT: z.coerce.number().default(30_000),
  DATABASE_CONNECTION_RETRIES: z.coerce.number().default(5),
  DATABASE_RETRY_DELAY: z.coerce.number().default(2000),

  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_TLS: z.string().default('false').transform((v) => v === 'true'),
  REDIS_KEY_PREFIX: z.string().default('tienda:'),
  REDIS_CONNECT_TIMEOUT: z.coerce.number().default(10_000),
  REDIS_RETRY_MAX_ATTEMPTS: z.coerce.number().default(10),
  REDIS_RETRY_BASE_DELAY: z.coerce.number().default(500),
  REDIS_RETRY_MAX_DELAY: z.coerce.number().default(30_000),
  REDIS_KEEP_ALIVE: z.coerce.number().default(30_000),
  REDIS_FAMILY: z.coerce.number().default(4),
  REDIS_ENABLE_OFFLINE_QUEUE: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
  REDIS_LAZY_CONNECT: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),

  JWT_SECRET: z.string().default('change-me-in-production'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('change-me-refresh-secret'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  STORAGE_ENDPOINT: z.string().default('http://localhost:9000'),
  STORAGE_ACCESS_KEY: z.string().default('minioadmin'),
  STORAGE_SECRET_KEY: z.string().default('minioadmin'),
  STORAGE_BUCKET: z.string().default('tienda-assets'),

  MAIL_HOST: z.string().default('smtp.mailtrap.io'),
  MAIL_PORT: z.coerce.number().default(2525),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),

  CACHE_TTL: z.coerce.number().default(86_400),
  CACHE_PREFIX: z.string().default('tienda:'),

  QUEUE_REDIS_URL: z.string().optional(),

  ENCRYPTION_KEY: z.string().optional(),
  BCRYPT_ROUNDS: z.coerce.number().default(12),

  RATE_LIMIT_TTL: z.coerce.number().default(60),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),

  API_VERSIONING_TYPE: z.enum(['uri', 'header', 'media-type']).default('uri'),
  API_DEFAULT_VERSION: z.string().default('1.0'),
  API_SUPPORTED_VERSIONS: z.string().default('1.0'),
  API_DEFAULT_LIMIT: z.coerce.number().default(20),
  API_MAX_LIMIT: z.coerce.number().default(100),

  HTTP_DRIVER: z.enum(['undici', 'axios', 'got']).default('undici'),
  HTTP_BASE_URL: z.string().default(''),
  HTTP_TIMEOUT: z.coerce.number().default(10_000),
  HTTP_CONNECT_TIMEOUT: z.coerce.number().default(3_000),
  HTTP_READ_TIMEOUT: z.coerce.number().default(10_000),
  HTTP_WRITE_TIMEOUT: z.coerce.number().default(10_000),
  HTTP_REQUEST_TIMEOUT: z.coerce.number().default(10_000),
  HTTP_MAX_RETRIES: z.coerce.number().default(3),
  HTTP_RETRY_DELAY: z.coerce.number().default(500),
  HTTP_KEEP_ALIVE: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
  HTTP_MAX_CONNECTIONS: z.coerce.number().default(10),

  NEXT_PUBLIC_API_URL: z.string().default('http://localhost:4000/api/v1'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.0.0'),
});

export type Env = z.infer<typeof envSchema>;
