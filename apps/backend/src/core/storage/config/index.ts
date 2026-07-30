import { Injectable } from '@nestjs/common';
import { storageConfig } from '@tienda/config';
import { STORAGE_DEFAULTS } from '../constants/storage-defaults';
import { ConfigurationErrorException } from '../exceptions/configuration-error.exception';
import type { StorageDriverType, StorageDriverConfig } from '../types';

@Injectable()
export class StorageConfigurationFactory {
  private readonly config: StorageDriverConfig;

  constructor() {
    const cfg = storageConfig();

    const driver = this.resolveDriverType();

    this.config = {
      driver,
      localPath: process.env['STORAGE_LOCAL_PATH'] ?? STORAGE_DEFAULTS.LOCAL_PATH,
      endpoint: cfg.endpoint,
      region: process.env['STORAGE_REGION'] ?? STORAGE_DEFAULTS.DEFAULT_REGION,
      accessKey: cfg.accessKey,
      secretKey: cfg.secretKey,
      bucket: cfg.bucket,
      forcePathStyle: this.parseBool(process.env['STORAGE_FORCE_PATH_STYLE'], STORAGE_DEFAULTS.FORCE_PATH_STYLE),
      maxFileSize: this.parseNum(process.env['STORAGE_MAX_FILE_SIZE'], STORAGE_DEFAULTS.MAX_FILE_SIZE),
      allowedMimeTypes: [...STORAGE_DEFAULTS.ALLOWED_MIME_TYPES],
    };
  }

  getConfiguration(): StorageDriverConfig {
    return { ...this.config };
  }

  getDriverType(): StorageDriverType {
    return this.config.driver;
  }

  validate(): void {
    const cfg = this.config;

    if (cfg.driver === 's3') {
      if (!cfg.endpoint) {
        throw new ConfigurationErrorException('S3 endpoint is required');
      }
      if (!cfg.accessKey) {
        throw new ConfigurationErrorException('S3 access key is required');
      }
      if (!cfg.secretKey) {
        throw new ConfigurationErrorException('S3 secret key is required');
      }
      if (!cfg.bucket) {
        throw new ConfigurationErrorException('S3 bucket is required');
      }
    }

    if (cfg.driver === 'local' && !cfg.localPath) {
      throw new ConfigurationErrorException('Local storage path is required');
    }
  }

  private resolveDriverType(): StorageDriverType {
    const env = process.env['STORAGE_DRIVER'];
    if (env === 'local' || env === 's3' || env === 'memory') return env;
    if (env === 'r2' || env === 'minio') return 's3';
    return 'local';
  }

  private parseBool(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  private parseNum(value: string | undefined, defaultValue: number): number {
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
}
