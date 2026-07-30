import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { FixtureMetadata } from '../types';

export class FixtureLoader {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath ?? join(process.cwd(), 'test', 'fixtures');
  }

  setBasePath(path: string): void {
    this.basePath = path;
  }

  loadJson<T = unknown>(name: string): T {
    const filePath = this.resolvePath(name, 'json');
    return this.parseJson<T>(this.readFile(filePath));
  }

  loadText(name: string): string {
    const filePath = this.resolvePath(name, 'txt');
    return this.readFile(filePath).toString('utf-8');
  }

  loadBuffer(name: string, extension?: string): Buffer {
    const filePath = this.resolvePath(name, extension ?? 'bin');
    return this.readFile(filePath);
  }

  loadCsv(name: string): string[][] {
    const content = this.loadText(name);
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.split(',').map(cell => cell.trim()));
  }

  loadImage(name: string): Buffer {
    return this.loadBuffer(name, 'png');
  }

  loadPdf(name: string): Buffer {
    return this.loadBuffer(name, 'pdf');
  }

  exists(name: string, extension?: string): boolean {
    const filePath = this.resolvePath(name, extension ?? 'json');
    return existsSync(filePath);
  }

  getMetadata(name: string): FixtureMetadata {
    const filePath = this.resolvePath(name, 'json');
    const stats = existsSync(filePath)
      ? { size: 0, mtime: new Date() }
      : { size: 0, mtime: new Date() };

    return {
      name,
      path: filePath,
      size: stats.size,
      mimeType: this.getMimeType('json'),
      createdAt: stats.mtime.toISOString(),
    };
  }

  private resolvePath(name: string, extension: string): string {
    if (name.includes('/')) {
      return join(this.basePath, `${name}.${extension}`);
    }
    return join(this.basePath, `${name}.${extension}`);
  }

  private readFile(filePath: string): Buffer {
    try {
      return readFileSync(filePath);
    } catch {
      throw new Error(`Fixture not found: ${filePath}`);
    }
  }

  private parseJson<T>(buffer: Buffer): T {
    try {
      return JSON.parse(buffer.toString('utf-8')) as T;
    } catch {
      throw new Error(`Failed to parse JSON fixture`);
    }
  }

  private getMimeType(_extension: string): string {
    return 'application/octet-stream';
  }
}

export class FixtureBuilder {
  private data: Record<string, unknown> = {};

  set(key: string, value: unknown): this {
    this.data[key] = value;
    return this;
  }

  setNested(path: string, value: unknown): this {
    const keys = path.split('.');
    let current: Record<string, unknown> = this.data;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i] as string;
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    const lastKey = keys[keys.length - 1] as string;
    current[lastKey] = value;
    return this;
  }

  merge(data: Record<string, unknown>): this {
    this.data = { ...this.data, ...data };
    return this;
  }

  build(): Record<string, unknown> {
    return { ...this.data };
  }

  reset(): this {
    this.data = {};
    return this;
  }
}

export async function saveFixture(
  directory: string,
  name: string,
  data: unknown,
  format: 'json' | 'csv' | 'txt' = 'json',
): Promise<string> {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  const extensions: Record<string, string> = {
    json: 'json',
    csv: 'csv',
    txt: 'txt',
  };

  const extension = extensions[format] ?? 'json';
  const filePath = join(directory, `${name}.${extension}`);

  let content: string;
  switch (format) {
    case 'json':
      content = JSON.stringify(data, null, 2);
      break;
    case 'csv':
      content = Array.isArray(data) ? data.join('\n') : String(data);
      break;
    default:
      content = String(data);
  }

  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}
