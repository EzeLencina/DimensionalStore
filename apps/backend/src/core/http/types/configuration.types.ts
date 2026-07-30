import type { HttpDriverType } from './http.types';
import type { TimeoutConfig } from './request.types';
import type { DnsConfig } from './request.types';
import type { ProxyConfig } from './request.types';

export interface HttpConfiguration {
  driver: HttpDriverType;
  baseUrl: string;
  timeout: TimeoutConfig;
  maxRetries: number;
  retryDelay: number;
  retryStrategy: 'exponential' | 'linear' | 'jitter';
  retryJitter: boolean;
  keepAlive: boolean;
  maxConnections: number;
  dns: DnsConfig;
  defaultHeaders: Record<string, string>;
  proxy?: ProxyConfig;
  poolSize: number;
  pipelining: number;
  requestTimeout: number;
}
