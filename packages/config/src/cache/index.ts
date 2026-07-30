import { getEnv } from '../validation';

export interface CacheConfig {
  readonly ttl: number;
  readonly prefix: string;
}

let cached: CacheConfig | null = null;

export function cacheConfig(): CacheConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    ttl: env.CACHE_TTL,
    prefix: env.CACHE_PREFIX,
  };

  return cached;
}

export function resetCacheConfig(): void {
  cached = null;
}
