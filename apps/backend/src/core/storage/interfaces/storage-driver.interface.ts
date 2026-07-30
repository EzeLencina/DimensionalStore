import type {
  FileData,
  FileResult,
  FileMetadata,
  UploadOptions,
  ListOptions,
  FileEntry,
  MultipartUpload,
  Part,
  StorageHealth,
} from '../types';

export interface IStorageDriver {
  readonly name: string;

  upload(path: string, file: FileData, options?: UploadOptions): Promise<FileResult>;

  download(path: string): Promise<FileData>;

  delete(path: string): Promise<void>;

  copy(source: string, destination: string): Promise<FileResult>;

  move(source: string, destination: string): Promise<FileResult>;

  rename(path: string, newName: string): Promise<FileResult>;

  exists(path: string): Promise<boolean>;

  metadata(path: string): Promise<FileMetadata | null>;

  list(prefix: string, options?: ListOptions): Promise<FileEntry[]>;

  url(path: string): Promise<string>;

  signedUrl(path: string, expiresIn?: number): Promise<string>;

  createMultipartUpload(path: string): Promise<MultipartUpload>;

  completeMultipartUpload(path: string, uploadId: string, parts: Part[]): Promise<FileResult>;

  abortMultipartUpload(path: string, uploadId: string): Promise<void>;

  health(): Promise<StorageHealth>;
}
