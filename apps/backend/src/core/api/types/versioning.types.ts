export type VersioningType = 'uri' | 'header' | 'media-type';

export interface ApiVersion {
  major: number;
  minor: number;
  label: string;
}

export interface VersioningConfig {
  type: VersioningType;
  defaultVersion: string;
  supportedVersions: string[];
  headerName?: string;
  parameterName?: string;
}

export interface VersionedRequest {
  version: string;
  versionType: VersioningType;
}
