import { getEnv } from '../validation';

export interface StorageConfig {
  readonly endpoint: string;
  readonly accessKey: string;
  readonly secretKey: string;
  readonly bucket: string;
}

let cached: StorageConfig | null = null;

export function storageConfig(): StorageConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    endpoint: env.STORAGE_ENDPOINT,
    accessKey: env.STORAGE_ACCESS_KEY,
    secretKey: env.STORAGE_SECRET_KEY,
    bucket: env.STORAGE_BUCKET,
  };

  return cached;
}

export function resetStorageConfig(): void {
  cached = null;
}
