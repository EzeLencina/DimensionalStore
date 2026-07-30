import type { RequestLimitConfig } from '../types';
import { DEFAULT_REQUEST_LIMITS } from '../constants';
import { appConfig } from '@tienda/config';

export class RequestLimitsConfigurator {
  private readonly config: RequestLimitConfig;

  constructor(config?: Partial<RequestLimitConfig>) {
    this.config = { ...DEFAULT_REQUEST_LIMITS, ...config };
  }

  apply(app: any): void {
    const isProduction = appConfig().env === 'production';
    const jsonLimit = isProduction ? this.config.json : String(this.config.json);

    app.useBodyParser('json', { limit: jsonLimit });
    app.useBodyParser('urlencoded', {
      limit: this.config.urlencoded,
      extended: true,
    });
    app.useBodyParser('raw', { limit: this.config.raw });
    app.useBodyParser('text', { limit: this.config.text });
  }

  getQueryLimit(): number {
    return this.config.query;
  }

  getHeaderLimit(): number {
    return this.config.headers;
  }

  getConfig(): RequestLimitConfig {
    return { ...this.config };
  }
}
