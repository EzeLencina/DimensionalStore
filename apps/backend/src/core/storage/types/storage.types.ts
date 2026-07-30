export type StorageDriverType = 'local' | 's3' | 'memory';

export interface StorageDriverConfig {
  readonly driver: StorageDriverType;
  readonly localPath: string;
  readonly endpoint: string;
  readonly region: string;
  readonly accessKey: string;
  readonly secretKey: string;
  readonly bucket: string;
  readonly forcePathStyle: boolean;
  readonly maxFileSize: number;
  readonly allowedMimeTypes: string[];
}

export interface UploadOptions {
  mimetype?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
  storageClass?: string;
  contentType?: string;
}

export interface ListOptions {
  recursive?: boolean;
  maxKeys?: number;
  startAfter?: string;
  delimiter?: string;
}

export interface FileEntry {
  path: string;
  size: number;
  lastModified: Date;
  etag?: string;
  isDirectory: boolean;
}

export interface MultipartUpload {
  uploadId: string;
  path: string;
}

export interface Part {
  etag: string;
  partNumber: number;
}

export interface StorageHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  error?: string;
}

export type StorageOperation = 'upload' | 'download' | 'delete' | 'copy' | 'move' | 'list' | 'metadata';
