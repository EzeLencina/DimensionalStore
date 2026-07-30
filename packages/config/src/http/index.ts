import { getEnv } from '../validation';

export interface HttpConfig {
  readonly driver: string;
  readonly baseUrl: string;
  readonly timeout: number;
  readonly connectTimeout: number;
  readonly readTimeout: number;
  readonly writeTimeout: number;
  readonly maxRetries: number;
  readonly retryDelay: number;
  readonly keepAlive: boolean;
  readonly maxConnections: number;
  readonly requestTimeout: number;
}

let cached: HttpConfig | null = null;

export function httpConfig(): HttpConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    driver: env.HTTP_DRIVER,
    baseUrl: env.HTTP_BASE_URL,
    timeout: env.HTTP_TIMEOUT,
    connectTimeout: env.HTTP_CONNECT_TIMEOUT,
    readTimeout: env.HTTP_READ_TIMEOUT,
    writeTimeout: env.HTTP_WRITE_TIMEOUT,
    maxRetries: env.HTTP_MAX_RETRIES,
    retryDelay: env.HTTP_RETRY_DELAY,
    keepAlive: env.HTTP_KEEP_ALIVE,
    maxConnections: env.HTTP_MAX_CONNECTIONS,
    requestTimeout: env.HTTP_REQUEST_TIMEOUT,
  };

  return cached;
}

export function resetHttpConfig(): void {
  cached = null;
}
