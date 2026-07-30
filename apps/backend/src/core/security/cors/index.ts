import type { CorsPreset } from '../types';
import { corsConfig, appConfig } from '@tienda/config';

export interface CorsOptions {
  readonly origin: boolean | string[];
  readonly methods: string[];
  readonly allowedHeaders: string[];
  readonly credentials: boolean;
  readonly maxAge: number;
  readonly preflightContinue: boolean;
  readonly optionsSuccessStatus: number;
}

export class CorsConfigurator {
  private readonly presets: Record<CorsPreset, () => CorsOptions>;

  constructor() {
    this.presets = {
      development: () => this.createDevelopmentConfig(),
      testing: () => this.createTestingConfig(),
      production: () => this.createProductionConfig(),
    };
  }

  configure(preset?: CorsPreset): CorsOptions {
    const effective = preset ?? this.detectPreset();
    return this.presets[effective]();
  }

  private detectPreset(): CorsPreset {
    const env = appConfig().env;
    if (env === 'development') return 'development';
    if (env === 'test') return 'testing';
    return 'production';
  }

  private createDevelopmentConfig(): CorsOptions {
    return {
      origin: ['http://localhost:3000', 'http://localhost:4000'],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-CSRF-Token',
        'X-Correlation-Id',
        'X-Request-Id',
        'X-Tenant-Slug',
      ],
      credentials: true,
      maxAge: 86_400,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    };
  }

  private createTestingConfig(): CorsOptions {
    return {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-CSRF-Token',
        'X-Correlation-Id',
        'X-Request-Id',
      ],
      credentials: true,
      maxAge: 600,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    };
  }

  private createProductionConfig(): CorsOptions {
    const config = corsConfig();
    return {
      origin: config.origins,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-CSRF-Token',
        'X-Correlation-Id',
        'X-Request-Id',
        'X-Tenant-Slug',
        'X-Idempotency-Key',
      ],
      credentials: config.credentials,
      maxAge: 86_400,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    };
  }
}
