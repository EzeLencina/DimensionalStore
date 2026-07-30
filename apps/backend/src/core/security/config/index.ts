import type { CorsPreset } from '../types';
import { corsConfig, rateLimitConfig, appConfig } from '@tienda/config';
import {
  DEFAULT_REQUEST_LIMITS,
  DEFAULT_PAYLOAD_LIMITS,
  DEFAULT_HELMET_POLICY,
  GLOBAL_RATE_LIMIT,
  API_RATE_LIMIT,
  AUTH_RATE_LIMIT,
} from '../constants';
import type {
  SecurityOptions,
  RateLimitStrategy,
  RequestLimitConfig,
  PayloadLimitConfig,
  HelmetPolicy,
} from '../types';

export class SecurityConfigurationFactory {
  getOptions(): SecurityOptions {
    const env = appConfig().env;
    const isProduction = env === 'production';

    return {
      helmet: true,
      cors: true,
      rateLimit: true,
      csrf: isProduction,
      compression: isProduction,
      trustedProxy: isProduction,
      requestLimits: true,
      payloadLimits: true,
      securityHeaders: true,
    };
  }

  getCorsPreset(): CorsPreset {
    const env = appConfig().env;
    if (env === 'development') return 'development';
    if (env === 'test') return 'testing';
    return 'production';
  }

  getRateLimitStrategies(): RateLimitStrategy[] {
    const env = appConfig().env;
    const multiplier = env === 'development' || env === 'test' ? 10 : 1;

    return [
      { ...GLOBAL_RATE_LIMIT, limit: GLOBAL_RATE_LIMIT.limit * multiplier },
      { ...API_RATE_LIMIT, limit: API_RATE_LIMIT.limit * multiplier },
      { ...AUTH_RATE_LIMIT, limit: AUTH_RATE_LIMIT.limit * multiplier },
    ];
  }

  getRequestLimits(): RequestLimitConfig {
    return { ...DEFAULT_REQUEST_LIMITS };
  }

  getPayloadLimits(): PayloadLimitConfig {
    return { ...DEFAULT_PAYLOAD_LIMITS };
  }

  getHelmetPolicy(): HelmetPolicy {
    return { ...DEFAULT_HELMET_POLICY };
  }
}
