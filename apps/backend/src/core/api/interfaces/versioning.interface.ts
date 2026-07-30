import type { VersioningType, ApiVersion, VersioningConfig } from '../types';

export interface IVersioningService {
  readonly type: VersioningType;

  getVersion(request: Record<string, unknown>): string;

  isSupported(version: string): boolean;

  getConfig(): VersioningConfig;

  getDefaultVersion(): string;

  getSupportedVersions(): string[];

  compare(v1: string, v2: string): number;

  parseVersion(version: string): ApiVersion;
}
