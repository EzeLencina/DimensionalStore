import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
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
import { StorageConfigurationFactory } from '../config';
import {
  UploadFailedException,
  DownloadFailedException,
  DeleteFailedException,
  ProviderUnavailableException,
} from '../exceptions';

@Injectable()
export class LocalDriver implements IStorageDriver {
  readonly name = 'local';

  private readonly basePath: string;
  private readonly logger = new Logger(LocalDriver.name);

  constructor(configFactory: StorageConfigurationFactory) {
    const config = configFactory.getConfiguration();
    this.basePath = path.resolve(config.localPath);
    this.ensureBasePath();
  }

  async upload(filePath: string, file: FileData, _options?: UploadOptions): Promise<FileResult> {
    try {
      const fullPath = this.resolvePath(filePath);
      await this.ensureDirectory(fullPath);

      if (file.buffer) {
        await fs.promises.writeFile(fullPath, file.buffer);
      } else if (file.stream) {
        await this.writeStream(fullPath, file.stream);
      } else {
        throw new UploadFailedException('No file data provided');
      }

      const stat = await fs.promises.stat(fullPath);

      return {
        path: filePath,
        size: stat.size,
        mimetype: _options?.mimetype ?? 'application/octet-stream',
        etag: this.generateEtag(),
        lastModified: stat.mtime,
      };
    } catch (error) {
      if (error instanceof UploadFailedException) throw error;
      throw new UploadFailedException(
        `Failed to upload file: ${(error as Error).message}`,
        { path: filePath, error: (error as Error).message },
      );
    }
  }

  async download(filePath: string): Promise<FileData> {
    try {
      const fullPath = this.resolvePath(filePath);
      const buffer = await fs.promises.readFile(fullPath);
      const stat = await fs.promises.stat(fullPath);

      return {
        buffer,
        size: stat.size,
        mimetype: this.guessMimeType(filePath),
      };
    } catch (error) {
      throw new DownloadFailedException(
        `Failed to download file: ${(error as Error).message}`,
        { path: filePath, error: (error as Error).message },
      );
    }
  }

  async delete(filePath: string): Promise<void> {
    try {
      const fullPath = this.resolvePath(filePath);
      await fs.promises.unlink(fullPath);
    } catch (error) {
      throw new DeleteFailedException(
        `Failed to delete file: ${(error as Error).message}`,
        { path: filePath, error: (error as Error).message },
      );
    }
  }

  async copy(source: string, destination: string): Promise<FileResult> {
    try {
      const sourcePath = this.resolvePath(source);
      const destPath = this.resolvePath(destination);
      await this.ensureDirectory(destPath);
      await fs.promises.copyFile(sourcePath, destPath);
      const stat = await fs.promises.stat(destPath);

      return {
        path: destination,
        size: stat.size,
        mimetype: this.guessMimeType(destination),
        lastModified: stat.mtime,
      };
    } catch (error) {
      throw new UploadFailedException(
        `Failed to copy file: ${(error as Error).message}`,
        { source, destination, error: (error as Error).message },
      );
    }
  }

  async move(source: string, destination: string): Promise<FileResult> {
    try {
      const sourcePath = this.resolvePath(source);
      const destPath = this.resolvePath(destination);
      await this.ensureDirectory(destPath);
      await fs.promises.rename(sourcePath, destPath);
      const stat = await fs.promises.stat(destPath);

      return {
        path: destination,
        size: stat.size,
        mimetype: this.guessMimeType(destination),
        lastModified: stat.mtime,
      };
    } catch (error) {
      throw new UploadFailedException(
        `Failed to move file: ${(error as Error).message}`,
        { source, destination, error: (error as Error).message },
      );
    }
  }

  async rename(filePath: string, newName: string): Promise<FileResult> {
    const dir = path.dirname(filePath);
    const destination = path.posix.join(dir, newName);
    return this.move(filePath, destination);
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = this.resolvePath(filePath);
    try {
      await fs.promises.access(fullPath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async metadata(filePath: string): Promise<FileMetadata | null> {
    try {
      const fullPath = this.resolvePath(filePath);
      const stat = await fs.promises.stat(fullPath);

      return {
        path: filePath,
        size: stat.size,
        mimetype: this.guessMimeType(filePath),
        lastModified: stat.mtime,
        contentLength: stat.size,
      };
    } catch {
      return null;
    }
  }

  async list(prefix: string, options?: ListOptions): Promise<FileEntry[]> {
    try {
      const fullPrefix = this.resolvePath(prefix);
      const entries: FileEntry[] = [];

      if (!fs.existsSync(fullPrefix)) return entries;

      const files = await fs.promises.readdir(fullPrefix, { withFileTypes: true });
      const maxKeys = options?.maxKeys ?? 1000;
      let count = 0;

      for (const file of files) {
        if (count >= maxKeys) break;

        const relativePath = path.posix.join(prefix, file.name);

        if (file.isDirectory()) {
          entries.push({
            path: relativePath + '/',
            size: 0,
            lastModified: new Date(),
            isDirectory: true,
          });

          if (options?.recursive) {
            const subEntries = await this.list(relativePath, options);
            entries.push(...subEntries);
            count += subEntries.length;
          }
        } else {
          const stat = await fs.promises.stat(path.join(fullPrefix, file.name));
          entries.push({
            path: relativePath,
            size: stat.size,
            lastModified: stat.mtime,
            isDirectory: false,
          });
        }

        count++;
      }

      return entries;
    } catch (error) {
      this.logger.error({
        message: `Failed to list directory: ${(error as Error).message}`,
        context: 'LocalDriver',
        data: { prefix, error: (error as Error).message },
      });
      return [];
    }
  }

  async url(filePath: string): Promise<string> {
    const fullPath = this.resolvePath(filePath);
    return `file://${fullPath}`;
  }

  async signedUrl(_filePath: string, _expiresIn?: number): Promise<string> {
    return this.url(_filePath);
  }

  async createMultipartUpload(filePath: string): Promise<MultipartUpload> {
    const fullPath = this.resolvePath(filePath);
    await this.ensureDirectory(fullPath);
    return { uploadId: randomUUID(), path: filePath };
  }

  async completeMultipartUpload(filePath: string, _uploadId: string, _parts: Part[]): Promise<FileResult> {
    const stat = await fs.promises.stat(this.resolvePath(filePath));
    return {
      path: filePath,
      size: stat.size,
      mimetype: this.guessMimeType(filePath),
      lastModified: stat.mtime,
    };
  }

  async abortMultipartUpload(filePath: string, _uploadId: string): Promise<void> {
    const fullPath = this.resolvePath(filePath);
    try {
      await fs.promises.unlink(fullPath);
    } catch {
      // ignore if file doesn't exist
    }
  }

  async health(): Promise<StorageHealth> {
    const start = Date.now();
    try {
      await fs.promises.access(this.basePath, fs.constants.R_OK | fs.constants.W_OK);
      const latency = Date.now() - start;
      return { status: 'healthy', latency };
    } catch (error) {
      const latency = Date.now() - start;
      return {
        status: 'unhealthy',
        latency,
        error: (error as Error).message,
      };
    }
  }

  private resolvePath(filePath: string): string {
    const safe = filePath.replace(/\.\.\//g, '').replace(/\.\.\\/g, '');
    return path.join(this.basePath, safe);
  }

  private ensureBasePath(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  private async ensureDirectory(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }

  private writeStream(filePath: string, stream: NodeJS.ReadableStream): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  }

  private guessMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.csv': 'text/csv',
      '.json': 'application/json',
      '.txt': 'text/plain',
      '.zip': 'application/zip',
    };
    return mimeMap[ext] ?? 'application/octet-stream';
  }

  private generateEtag(): string {
    return `"${randomUUID().replace(/-/g, '')}"`;
  }
}
