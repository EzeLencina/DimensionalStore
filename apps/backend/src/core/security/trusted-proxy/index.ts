import type { TrustedProxyType } from '../types';
import { TRUSTED_PROXY_HEADERS } from '../constants';

export interface TrustedProxyOptions {
  readonly proxyType: TrustedProxyType;
  readonly trustedIps: string[];
  readonly customHeaders?: Record<string, string>;
}

export class TrustedProxyConfigurator {
  private static readonly PROXY_IPS: Record<TrustedProxyType, string[]> = {
    nginx: ['127.0.0.1', '::1'],
    cloudflare: [
      '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
      '104.16.0.0/13', '104.24.0.0/14', '108.162.192.0/18',
      '131.0.72.0/22', '141.101.64.0/18', '162.158.0.0/15',
      '172.64.0.0/13', '173.245.48.0/20', '188.114.96.0/20',
      '190.93.240.0/20', '197.234.240.0/22', '198.41.128.0/17',
    ],
    traefik: ['127.0.0.1', '::1'],
    'aws-alb': ['127.0.0.1', '::1'],
    custom: [],
  };

  private readonly options: TrustedProxyOptions;

  constructor(options?: Partial<TrustedProxyOptions>) {
    this.options = {
      proxyType: this.detectProxyType(),
      trustedIps: [],
      ...options,
    };
  }

  configure(app: any): void {
    if (app.set) {
      app.set('trust proxy', this.getTrustProxySetting());
    }
  }

  getTrustProxySetting(): string | number | string[] | ((ip: string) => boolean) {
    const { proxyType, trustedIps } = this.options;
    const defaultIps = TrustedProxyConfigurator.PROXY_IPS[proxyType] ?? [];
    const allIps = [...defaultIps, ...trustedIps];

    if (proxyType === 'cloudflare') {
      return (ip: string) => allIps.includes(ip);
    }

    if (allIps.length > 0) return allIps;

    return 1;
  }

  getRequestIp(req: any): string | undefined {
    const { proxyType } = this.options;

    if (proxyType === 'cloudflare') {
      return req.headers[TRUSTED_PROXY_HEADERS.CLOUDFLARE_IP] ?? req.ip;
    }

    return req.headers[TRUSTED_PROXY_HEADERS.FORWARDED_FOR]
      ?.split(',')[0]
      ?.trim()
      ?? req.headers[TRUSTED_PROXY_HEADERS.REAL_IP]
      ?? req.ip;
  }

  private detectProxyType(): TrustedProxyType {
    const env = process.env['TRUSTED_PROXY_TYPE']?.toLowerCase() ?? '';
    const valid: TrustedProxyType[] = ['nginx', 'cloudflare', 'traefik', 'aws-alb', 'custom'];
    return valid.includes(env as TrustedProxyType)
      ? (env as TrustedProxyType)
      : 'nginx';
  }
}
