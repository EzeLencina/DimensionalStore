import helmet from 'helmet';
import type { HelmetPolicy } from '../types';
import { DEFAULT_HELMET_POLICY } from '../constants';

export class HelmetConfigurator {
  private readonly policy: HelmetPolicy;

  constructor(policy?: Partial<HelmetPolicy>) {
    this.policy = { ...DEFAULT_HELMET_POLICY, ...policy };
  }

  configure(app: any): void {
    const directives = this.buildCspDirectives();

    app.use(
      helmet({
        contentSecurityPolicy: {
          directives,
        },
        frameguard: this.policy.frameguard,
        hidePoweredBy: this.policy.hidePoweredBy,
        noSniff: this.policy.noSniff,
        referrerPolicy: {
          policy: this.policy.referrerPolicy?.policy ?? 'strict-origin-when-cross-origin',
        },
        crossOriginOpenerPolicy: {
          policy: this.policy.crossOriginOpenerPolicy?.policy ?? 'same-origin-allow-popups',
        },
        crossOriginEmbedderPolicy: {
          policy: this.policy.crossOriginEmbedderPolicy?.policy ?? 'require-corp',
        },
        crossOriginResourcePolicy: {
          policy: this.policy.crossOriginResourcePolicy?.policy ?? 'same-origin',
        },
        strictTransportSecurity: this.policy.hsts,
        dnsPrefetchControl: this.policy.dnsPrefetchControl,
        ieNoOpen: this.policy.ieNoOpen,
        xssFilter: this.policy.xssFilter,
        originAgentCluster: true,
      }),
    );
  }

  private buildCspDirectives(): Record<string, string[]> {
    return {
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
      'frame-ancestors': ["'self'"],
      'upgrade-insecure-requests': [],
      ...this.policy.contentSecurityPolicy,
    };
  }
}
