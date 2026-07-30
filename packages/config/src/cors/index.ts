import { getEnv } from '../validation';

export interface CorsConfig {
  readonly origins: string[];
  readonly methods: string[];
  readonly credentials: boolean;
}

let cached: CorsConfig | null = null;

export function corsConfig(): CorsConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    origins: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  };

  return cached;
}

export function resetCorsConfig(): void {
  cached = null;
}
