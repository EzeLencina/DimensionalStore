import { INestApplication, Injectable } from '@nestjs/common';
import { CorsConfigurator } from './cors';
import { HelmetConfigurator } from './helmet';
import { SecurityHeadersConfigurator } from './headers';
import { TrustedProxyConfigurator } from './trusted-proxy';
import { RequestLimitsConfigurator } from './request-limits';
import { PayloadLimitsConfigurator } from './payload';
import { CompressionConfigurator } from './compression';
import { SecurityConfigurationFactory } from './config';

@Injectable()
export class SecurityBootstrap {
  constructor(
    private readonly config: SecurityConfigurationFactory,
    private readonly cors: CorsConfigurator,
    private readonly helmet: HelmetConfigurator,
    private readonly headers: SecurityHeadersConfigurator,
    private readonly proxy: TrustedProxyConfigurator,
    private readonly requestLimits: RequestLimitsConfigurator,
    private readonly payload: PayloadLimitsConfigurator,
    private readonly compression: CompressionConfigurator,
  ) {}

  apply(app: INestApplication): void {
    const options = this.config.getOptions();

    if (options.trustedProxy) {
      this.proxy.configure(app);
    }

    if (options.requestLimits) {
      this.requestLimits.apply(app);
    }

    if (options.payloadLimits) {
      this.payload.apply(app);
    }

    if (options.helmet) {
      this.helmet.configure(app);
    }

    if (options.securityHeaders) {
      this.headers.apply(app);
    }

    if (options.cors) {
      const corsOptions = this.cors.configure();
      app.enableCors(corsOptions);
    }

    if (options.compression) {
      this.compression.configure(app);
    }
  }
}
