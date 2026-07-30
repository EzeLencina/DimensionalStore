import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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
import {
  UploadFailedException,
  DownloadFailedException,
  DeleteFailedException,
} from '../exceptions';

interface MemoryFile {
  buffer: Buffer;
  mimetype: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  lastModified: Date;
}

@Injectable()
export class MemoryDriver implements IStorageDriver {
  readonly name = 'memory';

  private readonly store: Map<string, MemoryFile> = new Map();

  async upload(filePath: string, file: FileData, options?: UploadOptions): Promise<FileResult> {
    if (!file.buffer) {
      throw new UploadFailedException('Memory driver requires buffer data');
    }

    const memoryFile: MemoryFile = {
      buffer: file.buffer,
      mimetype: options?.mimetype ?? file.mimetype ?? 'application/octet-stream',
      metadata: options?.metadata,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    this.store.set(filePath, memoryFile);

    return {
      path: filePath,
      size: file.buffer.length,
      mimetype: memoryFile.mimetype,
      etag: this.generateEtag(),
      lastModified: memoryFile.lastModified,
    };
  }

  async download(filePath: string): Promise<FileData> {
    const file = this.store.get(filePath);
    if (!file) {
      throw new DownloadFailedException('File not found in memory store', { path: filePath });
    }

    return {
      buffer: Buffer.from(file.buffer),
      size: file.buffer.length,
      mimetype: file.mimetype,
    };
  }

  async delete(filePath: string): Promise<void> {
    const deleted = this.store.delete(filePath);
    if (!deleted) {
      throw new DeleteFailedException('File not found in memory store', { path: filePath });
    }
  }

  async copy(source: string, destination: string): Promise<FileResult> {
    const file = this.store.get(source);
    if (!file) {
      throw new UploadFailedException('Source file not found', { source });
    }

    const copy: MemoryFile = {
      buffer: Buffer.from(file.buffer),
      mimetype: file.mimetype,
      metadata: file.metadata,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    this.store.set(destination, copy);

    return {
      path: destination,
      size: copy.buffer.length,
      mimetype: copy.mimetype,
      etag: this.generateEtag(),
      lastModified: copy.lastModified,
    };
  }

  async move(source: string, destination: string): Promise<FileResult> {
    const file = this.store.get(source);
    if (!file) {
      throw new UploadFailedException('Source file not found', { source });
    }

    this.store.delete(source);

    const moved: MemoryFile = {
      ...file,
      lastModified: new Date(),
    };

    this.store.set(destination, moved);

    return {
      path: destination,
      size: moved.buffer.length,
      mimetype: moved.mimetype,
      etag: this.generateEtag(),
      lastModified: moved.lastModified,
    };
  }

  async rename(filePath: string, newName: string): Promise<FileResult> {
    const parts = filePath.split('/');
    parts.pop();
    parts.push(newName);
    const destination = parts.join('/');
    return this.move(filePath, destination);
  }

  async exists(filePath: string): Promise<boolean> {
    return this.store.has(filePath);
  }

  async metadata(filePath: string): Promise<FileMetadata | null> {
    const file = this.store.get(filePath);
    if (!file) return null;

    return {
      path: filePath,
      size: file.buffer.length,
      mimetype: file.mimetype,
      lastModified: file.lastModified,
      contentLength: file.buffer.length,
    };
  }

  async list(prefix: string, _options?: ListOptions): Promise<FileEntry[]> {
    const entries: FileEntry[] = [];

    for (const [key, file] of this.store) {
      if (key.startsWith(prefix)) {
        entries.push({
          path: key,
          size: file.buffer.length,
          lastModified: file.lastModified,
          isDirectory: false,
        });
      }
    }

    return entries;
  }

  async url(filePath: string): Promise<string> {
    return `memory://${filePath}`;
  }

  async signedUrl(filePath: string, _expiresIn?: number): Promise<string> {
    return this.url(filePath);
  }

  async createMultipartUpload(filePath: string): Promise<MultipartUpload> {
    return { uploadId: randomUUID(), path: filePath };
  }

  async completeMultipartUpload(filePath: string, _uploadId: string, _parts: Part[]): Promise<FileResult> {
    const file = this.store.get(filePath);
    if (!file) {
      throw new UploadFailedException('File not found', { path: filePath });
    }

    return {
      path: filePath,
      size: file.buffer.length,
      mimetype: file.mimetype,
      lastModified: file.lastModified,
    };
  }

  async abortMultipartUpload(filePath: string, _uploadId: string): Promise<void> {
    this.store.delete(filePath);
  }

  async health(): Promise<StorageHealth> {
    return { status: 'healthy', latency: 0 };
  }

  clear(): void {
    this.store.clear();
  }

  count(): number {
    return this.store.size;
  }

  private generateEtag(): string {
    return `"${randomUUID().replace(/-/g, '')}"`;
  }
}
