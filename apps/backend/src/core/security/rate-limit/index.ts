import { ThrottlerModuleOptions, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import type { RateLimitStrategy } from '../types';
import { GLOBAL_RATE_LIMIT, API_RATE_LIMIT, AUTH_RATE_LIMIT } from '../constants';

export interface RateLimitOptions {
  readonly global: RateLimitStrategy;
  readonly api: RateLimitStrategy;
  readonly auth: RateLimitStrategy;
}

export class RateLimitConfigurator {
  private readonly options: RateLimitOptions;

  constructor(options?: Partial<RateLimitOptions>) {
    this.options = {
      global: GLOBAL_RATE_LIMIT,
      api: API_RATE_LIMIT,
      auth: AUTH_RATE_LIMIT,
      ...options,
    };
  }

  getThrottlerModuleOptions(): ThrottlerModuleOptions {
    return {
      throttlers: [
        {
          name: this.options.global.name,
          ttl: this.options.global.ttl,
          limit: this.options.global.limit,
        },
        {
          name: this.options.api.name,
          ttl: this.options.api.ttl,
          limit: this.options.api.limit,
        },
      ],
    };
  }

  getGlobalGuard() {
    return {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    };
  }

  getStrategies(): RateLimitStrategy[] {
    return [this.options.global, this.options.api, this.options.auth];
  }
}
