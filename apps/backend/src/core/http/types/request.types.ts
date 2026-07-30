import type { RequestTiming } from './timing.types';
import type { HttpMethod, HttpResponseType, RequestPriority, HttpProtocol, TlsVersion } from './http.types';

export interface RetryPolicyConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  strategy: 'exponential' | 'linear' | 'jitter';
  statusCodes?: number[];
  methods?: string[];
}

export interface TimeoutConfig {
  requestTimeout: number;
  connectTimeout: number;
  readTimeout: number;
  writeTimeout: number;
}

export interface DnsConfig {
  cache: boolean;
  cacheTTL: number;
  servers?: string[];
}

export interface TlsConfig {
  rejectUnauthorized: boolean;
  minVersion: TlsVersion;
  maxVersion: TlsVersion;
  ca?: Buffer[];
  cert?: Buffer;
  key?: Buffer;
}

export interface ProxyConfig {
  host: string;
  port: number;
  protocol: HttpProtocol;
  auth?: {
    username: string;
    password: string;
  };
}

export interface HttpRequestOptions {
  method: HttpMethod;
  url: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
  retry?: RetryPolicyConfig;
  responseType?: HttpResponseType;
  priority?: RequestPriority;
  idempotent?: boolean;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  duration: number;
  retries: number;
  timing: RequestTiming;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'unavailable';
  latency: number;
  timestamp: string;
  details?: Record<string, unknown>;
}
