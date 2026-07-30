import type {
  RequestLimitConfig,
  PayloadLimitConfig,
  HelmetPolicy,
  RateLimitStrategy,
  CrossOriginOpenerPolicyValue,
  CrossOriginEmbedderPolicyValue,
  CrossOriginResourcePolicyValue,
  ReferrerPolicyValue,
} from '../types';

const defaultReferrerPolicy: ReferrerPolicyValue = 'strict-origin-when-cross-origin';
const defaultCoop: CrossOriginOpenerPolicyValue = 'same-origin-allow-popups';
const defaultCoep: CrossOriginEmbedderPolicyValue = 'require-corp';
const defaultCorp: CrossOriginResourcePolicyValue = 'same-origin';

export const DEFAULT_REQUEST_LIMITS: RequestLimitConfig = {
  body: 1_048_576,
  query: 100,
  headers: 16_384,
  json: 1_048_576,
  urlencoded: 1_048_576,
  raw: 1_048_576,
  text: 1_048_576,
};

export const DEFAULT_PAYLOAD_LIMITS: PayloadLimitConfig = {
  multipart: 10_485_760,
  upload: 52_428_800,
  maxFileCount: 10,
  maxFieldSize: 1_048_576,
  maxFields: 50,
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/json',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

export const DEFAULT_HELMET_POLICY: HelmetPolicy = {
  contentSecurityPolicy: {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },
  frameguard: { action: 'sameorigin' },
  hidePoweredBy: true,
  noSniff: true,
  referrerPolicy: { policy: defaultReferrerPolicy },
  permissionsPolicy: {
    camera: ['()'],
    microphone: ['()'],
    geolocation: ['()'],
    payment: ['()'],
    usb: ['()'],
    'interest-cohort': ['()'],
  },
  crossOriginOpenerPolicy: { policy: defaultCoop },
  crossOriginEmbedderPolicy: { policy: defaultCoep },
  crossOriginResourcePolicy: { policy: defaultCorp },
  hsts: {
    maxAge: 31_536_000,
    includeSubDomains: true,
    preload: true,
  },
  dnsPrefetchControl: { allow: false },
  ieNoOpen: true,
  xssFilter: true,
};

export const GLOBAL_RATE_LIMIT: RateLimitStrategy = {
  name: 'global',
  ttl: 60_000,
  limit: 100,
  burstLimit: 150,
};

export const API_RATE_LIMIT: RateLimitStrategy = {
  name: 'api',
  ttl: 60_000,
  limit: 60,
  burstLimit: 80,
};

export const AUTH_RATE_LIMIT: RateLimitStrategy = {
  name: 'auth',
  ttl: 60_000,
  limit: 10,
  burstLimit: 15,
};

export const SECURITY_HEADER_NAMES = {
  STRICT_TRANSPORT_SECURITY: 'Strict-Transport-Security',
  CONTENT_SECURITY_POLICY: 'Content-Security-Policy',
  X_FRAME_OPTIONS: 'X-Frame-Options',
  X_CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
  X_XSS_PROTECTION: 'X-XSS-Protection',
  REFERRER_POLICY: 'Referrer-Policy',
  PERMISSIONS_POLICY: 'Permissions-Policy',
  CROSS_ORIGIN_OPENER_POLICY: 'Cross-Origin-Opener-Policy',
  CROSS_ORIGIN_EMBEDDER_POLICY: 'Cross-Origin-Embedder-Policy',
  CROSS_ORIGIN_RESOURCE_POLICY: 'Cross-Origin-Resource-Policy',
  X_POWERED_BY: 'X-Powered-By',
  X_DNS_PREFETCH_CONTROL: 'X-DNS-Prefetch-Control',
  X_DOWNLOAD_OPTIONS: 'X-Download-Options',
} as const;

export const TRUSTED_PROXY_HEADERS = {
  FORWARDED_FOR: 'x-forwarded-for',
  FORWARDED_PROTO: 'x-forwarded-proto',
  FORWARDED_HOST: 'x-forwarded-host',
  FORWARDED_PORT: 'x-forwarded-port',
  REAL_IP: 'x-real-ip',
  REQUEST_ID: 'x-request-id',
  CORRELATION_ID: 'x-correlation-id',
  CLOUDFLARE_IP: 'cf-connecting-ip',
  CLOUDFLARE_IP_COUNTRY: 'cf-ipcountry',
  CLOUDFLARE_RAY: 'cf-ray',
  CLOUDFLARE_TLS: 'cf-tls-version',
  AWS_ALB_TRACE: 'x-amzn-trace-id',
} as const;

export const COMPRESSION_CONTENT_TYPES = [
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'application/json',
  'application/xml',
  'application/graphql',
  'image/svg+xml',
] as const;

export const CSRF_DEFAULTS = {
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'strict' as const,
    path: '/',
  },
} as const;
