import { getEnv } from '../validation';

export interface RateLimitConfig {
  readonly ttl: number;
  readonly max: number;
}

let cached: RateLimitConfig | null = null;

export function rateLimitConfig(): RateLimitConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    ttl: env.RATE_LIMIT_TTL,
    max: env.RATE_LIMIT_MAX,
  };

  return cached;
}

export function resetRateLimitConfig(): void {
  cached = null;
}
