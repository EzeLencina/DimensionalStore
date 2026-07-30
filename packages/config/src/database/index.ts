import { getEnv } from '../validation';

export interface DatabaseConfig {
  readonly url: string;
  readonly directUrl?: string;
  readonly shadowUrl?: string;
  readonly replicaUrl?: string;
  readonly poolMin: number;
  readonly poolMax: number;
  readonly ssl: boolean;
  readonly queryTimeout: number;
  readonly connectionRetries: number;
  readonly retryDelay: number;
}

let cached: DatabaseConfig | null = null;

export function databaseConfig(): DatabaseConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    url: env.DATABASE_URL,
    directUrl: env.DATABASE_URL_DIRECT,
    shadowUrl: env.SHADOW_DATABASE_URL,
    replicaUrl: env.DATABASE_URL_REPLICA,
    poolMin: env.DATABASE_POOL_MIN,
    poolMax: env.DATABASE_POOL_MAX,
    ssl: env.DATABASE_SSL,
    queryTimeout: env.DATABASE_QUERY_TIMEOUT,
    connectionRetries: env.DATABASE_CONNECTION_RETRIES,
    retryDelay: env.DATABASE_RETRY_DELAY,
  };

  return cached;
}

export function resetDatabaseConfig(): void {
  cached = null;
}
