import { Injectable, Logger } from '@nestjs/common';
import { BaseHttpDriver } from './base-driver';
import { HttpConfigurationFactory } from '../config';
import type { HttpRequestOptions, HttpResponse, HealthCheckResponse } from '../types';
import { HttpRequestFailedException, HttpTimeoutException, HttpConnectionFailedException } from '../exceptions';

@Injectable()
export class UndiciDriver extends BaseHttpDriver {
  readonly name = 'undici';

  private readonly logger = new Logger(UndiciDriver.name);

  constructor(
    private readonly configFactory: HttpConfigurationFactory,
  ) {
    super();
  }

  async request<T = unknown>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    const config = this.configFactory.getConfiguration();
    const url = this.buildUrl(config.baseUrl, options.url);
    const queryString = this.buildQueryString(options.query);
    const fullUrl = `${url}${queryString}`;
    const startTime = Date.now();

    this.logger.debug({
      message: `HTTP ${options.method} ${fullUrl}`,
      context: 'UndiciDriver',
      data: { method: options.method, url: fullUrl },
    });

    try {
      const headers: Record<string, string> = this.mergeHeaders(
        config.defaultHeaders,
        options.headers,
      );

      const fetchOptions: RequestInit = {
        method: options.method,
        headers,
        signal: options.signal ?? AbortSignal.timeout(options.timeout ?? config.requestTimeout),
      };

      if (options.body != null && options.method !== 'GET' && options.method !== 'HEAD') {
        fetchOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(fullUrl, fetchOptions);
      const duration = Date.now() - startTime;

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data: T;

      if (response.status === 204 || response.status === 205 || options.method === 'HEAD') {
        data = undefined as T;
      } else {
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
          data = (await response.json()) as T;
        } else {
          data = (await response.text()) as T;
        }
      }

      if (!response.ok) {
        throw new HttpRequestFailedException(
          `HTTP ${response.status} ${response.statusText}`,
          {
            url: fullUrl,
            method: options.method,
            status: response.status,
            statusText: response.statusText,
            duration,
          },
        );
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        duration,
        retries: 0,
        timing: {
          dns: 0,
          connect: 0,
          tls: 0,
          firstByte: 0,
          total: duration,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      if (error instanceof HttpRequestFailedException) {
        throw error;
      }

      if ((error as Error).name === 'AbortError' || (error as Error).name === 'TimeoutError') {
        throw new HttpTimeoutException(
          `Request timed out after ${config.requestTimeout}ms`,
          { url: fullUrl, method: options.method, duration, timeout: config.requestTimeout },
        );
      }

      if ((error as Error).message?.includes('connect') || (error as Error).message?.includes('ECONNREFUSED')) {
        throw new HttpConnectionFailedException(
          (error as Error).message,
          { url: fullUrl, method: options.method, duration },
        );
      }

      throw new HttpRequestFailedException(
        (error as Error).message,
        { url: fullUrl, method: options.method, duration },
      );
    }
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const config = this.configFactory.getConfiguration();
    const startTime = Date.now();

    try {
      await this.get(config.baseUrl || 'http://localhost:8080/health', { timeout: 5_000 });

      return {
        status: 'ok',
        latency: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'degraded',
        latency: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        details: { error: 'Health check request failed' },
      };
    }
  }
}
