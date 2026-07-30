import type { CorsPreset, TrustedProxyType, HelmetPolicy } from '../types';
import type { CorsConfig } from '@tienda/config';
import type { AppConfig } from '@tienda/config';

export interface SecurityConfigProvider {
  getCorsConfig(preset?: CorsPreset): CorsConfig & { allowedHeaders: string[]; maxAge: number };
  getHelmetPolicy(): HelmetPolicy;
  getTrustedProxyConfig(): { proxyType: TrustedProxyType; trustedIps: string[] };
  isEnabled(): { helmet: boolean; cors: boolean; rateLimit: boolean; csrf: boolean; compression: boolean };
}

export interface CorsConfigFactory {
  createDevelopmentConfig(): CorsConfig & { allowedHeaders: string[]; maxAge: number };
  createTestingConfig(): CorsConfig & { allowedHeaders: string[]; maxAge: number };
  createProductionConfig(): CorsConfig & { allowedHeaders: string[]; maxAge: number };
}

export interface SecurityHeadersService {
  apply(app: any): void;
  getSecurityHeadersPolicy(): Record<string, string>;
  getCspDirectives(): Record<string, string[]>;
}

export interface RateLimitConfigurator {
  configureGlobal(app: any): void;
  configureApi(app: any): void;
  configureBurst(app: any): void;
  getConfigs(): Array<{ name: string; ttl: number; limit: number }>;
}

export interface CompressionConfigurator {
  configure(app: any): void;
  shouldCompress(req: any, res: any): boolean;
}

export interface RequestContextService {
  createContext(req: any): import('../types').SecurityContext;
  getCurrentContext(): import('../types').SecurityContext | null;
}

export interface SecurityMiddleware {
  apply(app: any): void;
}

export interface JwtFutureIntegration {
  readonly supportedAlgorithms: string[];
  readonly supportedKeyTypes: string[];
}

export interface SecurityAuditor {
  logSecurityEvent(event: string, details?: Record<string, unknown>): void;
}
