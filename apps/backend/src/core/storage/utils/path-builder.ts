import { randomUUID } from 'node:crypto';
import type { StorageNamespace, PathResult } from '../types';

export class PathBuilder {
  private static readonly NAMESPACE_MAP: Record<StorageNamespace, string> = {
    products: 'products',
    customers: 'customers',
    suppliers: 'suppliers',
    users: 'users',
    documents: 'documents',
    reports: 'reports',
    exports: 'exports',
    imports: 'imports',
    temp: 'temp',
    backups: 'backups',
    logos: 'logos',
    avatars: 'avatars',
    invoices: 'invoices',
    csv: 'csv',
  };

  build(namespace: StorageNamespace, ...segments: string[]): string {
    const base = PathBuilder.NAMESPACE_MAP[namespace];
    const parts = [base, ...segments.filter(Boolean)];
    return parts.join('/');
  }

  temp(...segments: string[]): string {
    return this.build('temp', ...segments);
  }

  withTimestamp(namespace: StorageNamespace, filename: string): string {
    const timestamp = Date.now();
    return this.build(namespace, `${timestamp}-${filename}`);
  }

  withUuid(namespace: StorageNamespace, filename: string): string {
    const uuid = randomUUID();
    return this.build(namespace, `${uuid}-${filename}`);
  }

  parse(fullPath: string): PathResult | null {
    const parts = fullPath.split('/');
    const namespace = parts[0] as StorageNamespace;

    if (!PathBuilder.NAMESPACE_MAP[namespace]) return null;

    const filename = parts[parts.length - 1] ?? '';
    const extension = filename.includes('.')
      ? filename.split('.').pop() ?? ''
      : '';
    const directory = parts.slice(0, -1).join('/');

    return {
      fullPath,
      directory,
      filename,
      extension: extension ? `.${extension}` : '',
      namespace,
    };
  }

  existsNamespace(namespace: string): namespace is StorageNamespace {
    return namespace in PathBuilder.NAMESPACE_MAP;
  }
}
