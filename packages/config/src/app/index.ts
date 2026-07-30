import { getEnv } from '../validation';

export interface AppConfig {
  readonly name: string;
  readonly port: number;
  readonly prefix: string;
  readonly env: string;
  readonly version: string;
  readonly url: string;
}

let cached: AppConfig | null = null;

export function appConfig(): AppConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    name: 'Tienda',
    port: env.PORT,
    prefix: env.API_PREFIX,
    env: env.NODE_ENV,
    version: env.NEXT_PUBLIC_APP_VERSION,
    url: env.NEXT_PUBLIC_API_URL,
  };

  return cached;
}

export function resetAppConfig(): void {
  cached = null;
}
