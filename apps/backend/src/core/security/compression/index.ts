import type { CompressionFormat } from '../types';
import { COMPRESSION_CONTENT_TYPES } from '../constants';
import { appConfig } from '@tienda/config';

export class CompressionConfigurator {
  private readonly format: CompressionFormat;
  private readonly threshold: number;
  private readonly contentTypes: RegExp;

  constructor(format?: CompressionFormat) {
    this.format = format ?? this.detectFormat();
    this.threshold = 1024;
    this.contentTypes = new RegExp(
      COMPRESSION_CONTENT_TYPES.map((t) => t.replace('/', '\\/')).join('|'),
    );
  }

  configure(app: any): void {
    if (this.format === 'none') return;

    const compression = this.loadCompression();

    app.use(
      compression({
        level: this.format === 'brotli' ? 6 : 9,
        threshold: this.threshold,
        filter: (req: any, res: any) => this.shouldCompress(req, res),
      }),
    );
  }

  shouldCompress(req: any, res: any): boolean {
    if (req.headers['x-no-compression']) return false;

    const contentType = res.getHeader('Content-Type') ?? '';
    const contentLength = parseInt(res.getHeader('Content-Length') ?? '0', 10);

    if (contentLength < this.threshold) return false;

    if (typeof contentType === 'string') {
      return this.contentTypes.test(contentType);
    }

    return true;
  }

  private loadCompression(): any {
    try {
      return require('compression');
    } catch {
      return () => (_req: any, _res: any, next: any) => next();
    }
  }

  private detectFormat(): CompressionFormat {
    const env = appConfig().env;
    if (env === 'production') return 'gzip';
    return 'none';
  }
}
