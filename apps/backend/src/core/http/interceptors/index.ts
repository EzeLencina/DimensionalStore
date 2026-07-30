import { Injectable, Logger } from '@nestjs/common';
import type { HttpRequestOptions, HttpResponse } from '../types';

export interface HttpInterceptor {
  intercept<T>(options: HttpRequestOptions, next: (opts: HttpRequestOptions) => Promise<HttpResponse<T>>): Promise<HttpResponse<T>>;
}

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private readonly logger = new Logger('HTTP');

  async intercept<T>(
    options: HttpRequestOptions,
    next: (opts: HttpRequestOptions) => Promise<HttpResponse<T>>,
  ): Promise<HttpResponse<T>> {
    const timestamp = Date.now();

    this.logger.log({
      message: `→ ${options.method} ${options.url}`,
      context: 'LoggingInterceptor',
      data: { method: options.method, url: options.url },
    });

    try {
      const response = await next(options);
      const duration = Date.now() - timestamp;

      this.logger.log({
        message: `← ${options.method} ${options.url} ${response.status} (${duration}ms)`,
        context: 'LoggingInterceptor',
        data: { status: response.status, duration },
      });

      return response;
    } catch (error) {
      const duration = Date.now() - timestamp;

      this.logger.error({
        message: `✗ ${options.method} ${options.url} (${duration}ms)`,
        context: 'LoggingInterceptor',
        data: { error: (error as Error).message, duration },
      });

      throw error;
    }
  }
}

@Injectable()
export class TracingInterceptor implements HttpInterceptor {
  async intercept<T>(
    options: HttpRequestOptions,
    next: (opts: HttpRequestOptions) => Promise<HttpResponse<T>>,
  ): Promise<HttpResponse<T>> {
    const headers = { ...options.headers, 'x-trace-id': crypto.randomUUID() };
    return next({ ...options, headers });
  }
}
