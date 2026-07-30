export type Environment = 'development' | 'test' | 'staging' | 'production';

export type CorsPreset = 'development' | 'testing' | 'production';

export type CompressionFormat = 'gzip' | 'brotli' | 'none';

export type TrustedProxyType =
  | 'nginx'
  | 'cloudflare'
  | 'traefik'
  | 'aws-alb'
  | 'custom';

export interface SecurityOptions {
  readonly helmet: boolean;
  readonly cors: boolean;
  readonly rateLimit: boolean;
  readonly csrf: boolean;
  readonly compression: boolean;
  readonly trustedProxy: boolean;
  readonly requestLimits: boolean;
  readonly payloadLimits: boolean;
  readonly securityHeaders: boolean;
}

export interface SecurityContext {
  readonly requestId: string;
  readonly correlationId: string;
  readonly ip: string;
  readonly userAgent: string;
  readonly locale: string;
  readonly timezone: string;
  readonly method: string;
  readonly path: string;
}

export interface CorsOriginPattern {
  readonly origin: string;
  readonly pattern: RegExp;
}

export type ReferrerPolicyValue =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export type CrossOriginOpenerPolicyValue =
  | 'same-origin'
  | 'same-origin-allow-popups'
  | 'noopener-allow-popups'
  | 'unsafe-none';

export type CrossOriginEmbedderPolicyValue =
  | 'require-corp'
  | 'credentialless'
  | 'unsafe-none';

export type CrossOriginResourcePolicyValue =
  | 'same-origin'
  | 'same-site'
  | 'cross-origin';

export interface HelmetPolicy {
  readonly contentSecurityPolicy?: Record<string, string[]>;
  readonly frameguard?: { action: 'deny' | 'sameorigin' };
  readonly hidePoweredBy?: boolean;
  readonly noSniff?: boolean;
  readonly referrerPolicy?: { policy: ReferrerPolicyValue };
  readonly permissionsPolicy?: Record<string, string[]>;
  readonly crossOriginOpenerPolicy?: { policy: CrossOriginOpenerPolicyValue };
  readonly crossOriginEmbedderPolicy?: { policy: CrossOriginEmbedderPolicyValue };
  readonly crossOriginResourcePolicy?: { policy: CrossOriginResourcePolicyValue };
  readonly hsts?: {
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  readonly dnsPrefetchControl?: { allow: boolean };
  readonly ieNoOpen?: boolean;
  readonly xssFilter?: boolean;
}

export interface RateLimitStrategy {
  readonly name: string;
  readonly ttl: number;
  readonly limit: number;
  readonly burstLimit?: number;
  readonly keyGenerator?: (context: any) => string;
}

export interface RequestLimitConfig {
  readonly body: number;
  readonly query: number;
  readonly headers: number;
  readonly json: number;
  readonly urlencoded: number;
  readonly raw: number;
  readonly text: number;
}

export interface PayloadLimitConfig {
  readonly multipart: number;
  readonly upload: number;
  readonly maxFileCount: number;
  readonly maxFieldSize: number;
  readonly maxFields: number;
  readonly allowedMimeTypes: string[];
}

export interface CompressionThreshold {
  readonly size: number;
  readonly contentType: RegExp;
}

export interface SecurityDefaults {
  readonly cors: CorsPreset;
  readonly rateLimit: RateLimitStrategy;
  readonly compression: CompressionFormat;
  readonly proxy: TrustedProxyType;
  readonly requestLimits: RequestLimitConfig;
  readonly payloadLimits: PayloadLimitConfig;
  readonly helmet: HelmetPolicy;
}
