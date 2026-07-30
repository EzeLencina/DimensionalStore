import type { Readable } from 'stream';

export interface FileData {
  buffer?: Buffer;
  stream?: Readable;
  path?: string;
  mimetype?: string;
  size?: number;
  originalName?: string;
  encoding?: string;
}

export interface FileResult {
  path: string;
  url?: string;
  size: number;
  mimetype: string;
  etag?: string;
  version?: string;
  lastModified?: Date;
  checksum?: string;
}

export interface FileMetadata {
  path: string;
  size: number;
  mimetype: string;
  etag?: string;
  version?: string;
  lastModified: Date;
  storageClass?: string;
  checksum?: string;
  metadata?: Record<string, string>;
  contentType?: string;
  contentLength?: number;
}

export interface FileFilter {
  extension?: string;
  mimeType?: string;
  maxSize?: number;
  minSize?: number;
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}
