export type StorageNamespace =
  | 'products'
  | 'customers'
  | 'suppliers'
  | 'users'
  | 'documents'
  | 'reports'
  | 'exports'
  | 'imports'
  | 'temp'
  | 'backups'
  | 'logos'
  | 'avatars'
  | 'invoices'
  | 'csv';

export interface PathConfig {
  readonly namespace: StorageNamespace;
  readonly prefix?: string;
  readonly maxDepth?: number;
}

export interface PathResult {
  readonly fullPath: string;
  readonly directory: string;
  readonly filename: string;
  readonly extension: string;
  readonly namespace: StorageNamespace;
}
