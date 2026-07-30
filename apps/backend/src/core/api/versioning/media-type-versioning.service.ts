import { Injectable } from '@nestjs/common';
import type { VersioningType, ApiVersion, VersioningConfig } from '../types';
import type { IVersioningService } from '../interfaces';
import { ApiConfigurationFactory } from '../config';
import { ApiVersionNotSupportedException, ApiVersioningConfigException } from '../exceptions';

@Injectable()
export class MediaTypeVersioningService implements IVersioningService {
  readonly type: VersioningType = 'media-type';
  private readonly config: VersioningConfig;

  constructor(configFactory: ApiConfigurationFactory) {
    this.config = configFactory.getVersioningConfig();
  }

  getVersion(request: Record<string, unknown>): string {
    const accept = (request['accept'] as string) ?? '';
    const match = accept.match(/application\/vnd\.tienda\.v(\d+)\+json/);

    if (!match) {
      return this.config.defaultVersion;
    }

    const versionString = match[1];
    if (!versionString) {
      return this.config.defaultVersion;
    }

    const version = `${versionString}.0`;

    if (!this.isSupported(version)) {
      throw new ApiVersionNotSupportedException(
        `API version "${version}" is not supported`,
        { version, supportedVersions: this.config.supportedVersions },
      );
    }

    return version;
  }

  isSupported(version: string): boolean {
    return this.config.supportedVersions.includes(version);
  }

  getConfig(): VersioningConfig {
    return { ...this.config };
  }

  getDefaultVersion(): string {
    return this.config.defaultVersion;
  }

  getSupportedVersions(): string[] {
    return [...this.config.supportedVersions];
  }

  compare(v1: string, v2: string): number {
    const [major1 = '0', minor1 = '0'] = v1.split('.');
    const [major2 = '0', minor2 = '0'] = v2.split('.');

    const majorDiff = parseInt(major1, 10) - parseInt(major2, 10);
    if (majorDiff !== 0) return majorDiff;

    return parseInt(minor1, 10) - parseInt(minor2, 10);
  }

  parseVersion(version: string): ApiVersion {
    const parts = version.split('.');
    const major = parseInt(parts[0] ?? '1', 10);
    const minor = parseInt(parts[1] ?? '0', 10);

    if (isNaN(major) || isNaN(minor)) {
      throw new ApiVersioningConfigException(
        `Invalid version format: "${version}"`,
        { version },
      );
    }

    return { major, minor, label: version };
  }
}
