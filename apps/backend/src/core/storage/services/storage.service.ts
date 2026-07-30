import { Injectable } from '@nestjs/common';
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
} from '../types';
import { StorageManagerService } from './storage-manager.service';
import { InvalidFileException } from '../exceptions';
import { PathBuilder } from '../utils/path-builder';
import type { StorageNamespace } from '../types';

@Injectable()
export class StorageService {
  private readonly pathBuilder = new PathBuilder();

  constructor(
    private readonly manager: StorageManagerService,
  ) {}

  private get driver(): IStorageDriver {
    return this.manager.getDriver();
  }

  async upload(
    namespace: StorageNamespace,
    filename: string,
    file: FileData,
    options?: UploadOptions,
  ): Promise<FileResult> {
    const path = this.pathBuilder.build(namespace, filename);
    return this.driver.upload(path, file, options);
  }

  async uploadTo(
    path: string,
    file: FileData,
    options?: UploadOptions,
  ): Promise<FileResult> {
    return this.driver.upload(path, file, options);
  }

  async download(path: string): Promise<FileData> {
    return this.driver.download(path);
  }

  async delete(path: string): Promise<void> {
    return this.driver.delete(path);
  }

  async copy(source: string, destination: string): Promise<FileResult> {
    return this.driver.copy(source, destination);
  }

  async move(source: string, destination: string): Promise<FileResult> {
    return this.driver.move(source, destination);
  }

  async rename(path: string, newName: string): Promise<FileResult> {
    return this.driver.rename(path, newName);
  }

  async exists(path: string): Promise<boolean> {
    return this.driver.exists(path);
  }

  async metadata(path: string): Promise<FileMetadata | null> {
    return this.driver.metadata(path);
  }

  async list(prefix: string, options?: ListOptions): Promise<FileEntry[]> {
    return this.driver.list(prefix, options);
  }

  async url(path: string): Promise<string> {
    return this.driver.url(path);
  }

  async signedUrl(path: string, expiresIn?: number): Promise<string> {
    return this.driver.signedUrl(path, expiresIn);
  }

  validateFile(file: FileData, maxSize?: number, allowedTypes?: string[]): void {
    if (!file.buffer && !file.stream) {
      throw new InvalidFileException('File must contain buffer or stream data');
    }

    if (maxSize && file.buffer && file.buffer.length > maxSize) {
      throw new InvalidFileException(
        'File exceeds maximum allowed size',
        { maxSize, actualSize: file.buffer.length },
      );
    }

    if (allowedTypes && allowedTypes.length > 0 && file.mimetype) {
      if (!allowedTypes.includes(file.mimetype)) {
        throw new InvalidFileException(
          'File type not allowed',
          { allowedTypes, receivedType: file.mimetype },
        );
      }
    }
  }
}
