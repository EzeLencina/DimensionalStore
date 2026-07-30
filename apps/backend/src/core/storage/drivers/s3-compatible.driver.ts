import { Injectable, Logger } from '@nestjs/common';
import type { IStorageDriver } from '../interfaces';
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
import { StorageConfigurationFactory } from '../config';
import { ProviderUnavailableException } from '../exceptions';

@Injectable()
export class S3CompatibleDriver implements IStorageDriver {
  readonly name = 's3';

  private readonly logger = new Logger(S3CompatibleDriver.name);

  constructor(
    configFactory: StorageConfigurationFactory,
  ) {
    const _config = configFactory.getConfiguration();
  }

  async upload(_path: string, _file: FileData, _options?: UploadOptions): Promise<FileResult> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async download(_path: string): Promise<FileData> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async delete(_path: string): Promise<void> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async copy(_source: string, _destination: string): Promise<FileResult> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async move(_source: string, _destination: string): Promise<FileResult> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async rename(_path: string, _newName: string): Promise<FileResult> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async exists(_path: string): Promise<boolean> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async metadata(_path: string): Promise<FileMetadata | null> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async list(_prefix: string, _options?: ListOptions): Promise<FileEntry[]> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async url(_path: string): Promise<string> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async signedUrl(_path: string, _expiresIn?: number): Promise<string> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async createMultipartUpload(_path: string): Promise<MultipartUpload> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async completeMultipartUpload(_path: string, _uploadId: string, _parts: Part[]): Promise<FileResult> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async abortMultipartUpload(_path: string, _uploadId: string): Promise<void> {
    throw new ProviderUnavailableException('S3 driver not implemented. Awaiting AWS SDK integration in future phase.');
  }

  async health(): Promise<StorageHealth> {
    return {
      status: 'unhealthy',
      latency: 0,
      error: 'S3 driver not implemented. Awaiting AWS SDK integration.',
    };
  }
}
