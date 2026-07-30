import { Injectable, Logger } from '@nestjs/common';
import type { VersioningType, VersioningConfig } from '../types';
import { API_DEFAULTS } from '../constants/api-defaults';

@Injectable()
export class ApiConfigurationFactory {
  private readonly logger = new Logger(ApiConfigurationFactory.name);
  private config: VersioningConfig | null = null;

  getVersioningConfig(): VersioningConfig {
    if (this.config) return this.config;

    const type = (process.env['API_VERSIONING_TYPE'] ?? API_DEFAULTS.VERSIONING_TYPE) as VersioningType;

    const rawVersions = process.env['API_SUPPORTED_VERSIONS'] ?? API_DEFAULTS.SUPPORTED_VERSIONS.join(',');
    const supportedVersions = rawVersions.split(',').map(v => v.trim()).filter(Boolean);

    this.config = {
      type,
      defaultVersion: process.env['API_DEFAULT_VERSION'] ?? API_DEFAULTS.VERSION,
      supportedVersions: supportedVersions.length > 0 ? supportedVersions : [API_DEFAULTS.VERSION],
      headerName: process.env['API_VERSION_HEADER'] ?? API_DEFAULTS.VERSION_HEADER,
      parameterName: process.env['API_VERSION_PARAM'] ?? 'version',
    };

    this.logger.log({
      message: 'API versioning configuration built',
      context: 'ApiConfigurationFactory',
      data: { type, defaultVersion: this.config.defaultVersion },
    });

    return this.config;
  }

  getDefaultLimit(): number {
    return Number(process.env['API_DEFAULT_LIMIT'] ?? API_DEFAULTS.DEFAULT_LIMIT);
  }

  getMaxLimit(): number {
    return Number(process.env['API_MAX_LIMIT'] ?? API_DEFAULTS.MAX_LIMIT);
  }

  getApiPrefix(): string {
    return process.env['API_PREFIX'] ?? API_DEFAULTS.API_PREFIX;
  }
}
