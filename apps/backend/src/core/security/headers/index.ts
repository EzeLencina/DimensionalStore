import { SECURITY_HEADER_NAMES } from '../constants';

export interface SecurityHeaderDirective {
  readonly name: string;
  readonly value: string;
  readonly env?: string[];
}

export class SecurityHeadersConfigurator {
  private readonly directives: SecurityHeaderDirective[];

  constructor() {
    this.directives = this.buildDirectives();
  }

  apply(app: any): void {
    app.use((req: any, res: any, next: any) => {
      for (const directive of this.directives) {
        res.setHeader(directive.name, directive.value);
      }
      next();
    });
  }

  getPolicyMap(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const d of this.directives) {
      map[d.name] = d.value;
    }
    return map;
  }

  private buildDirectives(): SecurityHeaderDirective[] {
    return [
      {
        name: SECURITY_HEADER_NAMES.STRICT_TRANSPORT_SECURITY,
        value: 'max-age=31536000; includeSubDomains; preload',
        env: ['production', 'staging'],
      },
      {
        name: SECURITY_HEADER_NAMES.X_FRAME_OPTIONS,
        value: 'SAMEORIGIN',
      },
      {
        name: SECURITY_HEADER_NAMES.X_CONTENT_TYPE_OPTIONS,
        value: 'nosniff',
      },
      {
        name: SECURITY_HEADER_NAMES.X_XSS_PROTECTION,
        value: '0',
      },
      {
        name: SECURITY_HEADER_NAMES.REFERRER_POLICY,
        value: 'strict-origin-when-cross-origin',
      },
      {
        name: SECURITY_HEADER_NAMES.PERMISSIONS_POLICY,
        value: this.buildPermissionsPolicy(),
      },
      {
        name: SECURITY_HEADER_NAMES.CROSS_ORIGIN_OPENER_POLICY,
        value: 'same-origin-allow-popups',
      },
      {
        name: SECURITY_HEADER_NAMES.CROSS_ORIGIN_RESOURCE_POLICY,
        value: 'same-origin',
      },
      {
        name: SECURITY_HEADER_NAMES.X_DNS_PREFETCH_CONTROL,
        value: 'off',
      },
      {
        name: SECURITY_HEADER_NAMES.X_DOWNLOAD_OPTIONS,
        value: 'noopen',
      },
    ];
  }

  private buildPermissionsPolicy(): string {
    return [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'interest-cohort=()',
      'fullscreen=(self)',
      'display-capture=(self)',
    ].join(', ');
  }
}
