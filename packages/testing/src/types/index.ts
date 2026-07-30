export interface FactoryConfig<T> {
  defaultProperties: Partial<T>;
  overrides?: Partial<T>;
}

export interface FactoryBuildOptions<T> {
  count?: number;
  overrides?: Partial<T>;
  sequence?: (index: number) => Partial<T>;
}

export interface FixtureMetadata {
  name: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface MockConfig {
  name: string;
  enabled: boolean;
  delay?: number;
  error?: boolean;
  errorMessage?: string;
}

export interface TestContext {
  requestId: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface PaginationTestParams {
  page: number;
  limit: number;
  totalCount: number;
}

export interface ApiTestResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface MockHttpResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body: T;
  delay?: number;
}
