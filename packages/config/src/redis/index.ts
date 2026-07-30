import { getEnv } from '../validation';

export interface RedisConfig {
  readonly url: string;
  readonly host: string;
  readonly port: number;
  readonly password?: string;
  readonly db: number;
  readonly tls: boolean;
  readonly keyPrefix: string;
  readonly connectTimeout: number;
  readonly retryMaxAttempts: number;
  readonly retryBaseDelay: number;
  readonly retryMaxDelay: number;
  readonly keepAlive: number;
  readonly family: number;
  readonly enableOfflineQueue: boolean;
  readonly lazyConnect: boolean;
}

let cached: RedisConfig | null = null;

export function redisConfig(): RedisConfig {
  if (cached) return cached;

  const env = getEnv();
  const url = new URL(env.REDIS_URL);

  cached = {
    url: env.REDIS_URL,
    host: url.hostname,
    port: Number(url.port) || 6379,
    password: env.REDIS_PASSWORD || url.password || undefined,
    db: env.REDIS_DB,
    tls: env.REDIS_TLS,
    keyPrefix: env.REDIS_KEY_PREFIX,
    connectTimeout: env.REDIS_CONNECT_TIMEOUT,
    retryMaxAttempts: env.REDIS_RETRY_MAX_ATTEMPTS,
    retryBaseDelay: env.REDIS_RETRY_BASE_DELAY,
    retryMaxDelay: env.REDIS_RETRY_MAX_DELAY,
    keepAlive: env.REDIS_KEEP_ALIVE,
    family: env.REDIS_FAMILY,
    enableOfflineQueue: env.REDIS_ENABLE_OFFLINE_QUEUE,
    lazyConnect: env.REDIS_LAZY_CONNECT,
  };

  return cached;
}

export function resetRedisConfig(): void {
  cached = null;
}
