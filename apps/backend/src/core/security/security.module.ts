import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SecurityConfigurationFactory } from './config';
import { CorsConfigurator } from './cors';
import { HelmetConfigurator } from './helmet';
import { SecurityHeadersConfigurator } from './headers';
import { CsrfArchitecture } from './csrf';
import { RateLimitConfigurator } from './rate-limit';
import { TrustedProxyConfigurator } from './trusted-proxy';
import { RequestLimitsConfigurator } from './request-limits';
import { PayloadLimitsConfigurator } from './payload';
import { CompressionConfigurator } from './compression';
import { SecurityBootstrap } from './security-bootstrap.service';

const rateLimitConfigurator = new RateLimitConfigurator();

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (config: SecurityConfigurationFactory) => {
        const configurator = new RateLimitConfigurator();
        const strategies = configurator.getStrategies();

        return {
          throttlers: strategies.map((s) => ({
            name: s.name,
            ttl: s.ttl,
            limit: s.limit,
          })),
        };
      },
      inject: [SecurityConfigurationFactory],
    }),
  ],
  providers: [
    SecurityConfigurationFactory,
    CorsConfigurator,
    HelmetConfigurator,
    SecurityHeadersConfigurator,
    CsrfArchitecture,
    RateLimitConfigurator,
    TrustedProxyConfigurator,
    RequestLimitsConfigurator,
    PayloadLimitsConfigurator,
    CompressionConfigurator,
    SecurityBootstrap,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [
    SecurityConfigurationFactory,
    CorsConfigurator,
    HelmetConfigurator,
    SecurityHeadersConfigurator,
    CsrfArchitecture,
    RateLimitConfigurator,
    TrustedProxyConfigurator,
    RequestLimitsConfigurator,
    PayloadLimitsConfigurator,
    CompressionConfigurator,
    SecurityBootstrap,
  ],
})
export class SecurityModule {}
