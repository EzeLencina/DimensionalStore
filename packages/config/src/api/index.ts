import { getEnv } from '../validation';

export interface ApiConfig {
  readonly versioningType: string;
  readonly defaultVersion: string;
  readonly supportedVersions: string[];
  readonly defaultLimit: number;
  readonly maxLimit: number;
  readonly apiPrefix: string;
}

let cached: ApiConfig | null = null;

export function apiConfig(): ApiConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    versioningType: env.API_VERSIONING_TYPE,
    defaultVersion: env.API_DEFAULT_VERSION,
    supportedVersions: env.API_SUPPORTED_VERSIONS.split(',').map(v => v.trim()).filter(Boolean),
    defaultLimit: env.API_DEFAULT_LIMIT,
    maxLimit: env.API_MAX_LIMIT,
    apiPrefix: env.API_PREFIX,
  };

  return cached;
}

export function resetApiConfig(): void {
  cached = null;
}
