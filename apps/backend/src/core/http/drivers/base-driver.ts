import type { IHttpClient } from '../interfaces';
import { RequestTimingCollector } from '../utils';
import type { HttpRequestOptions, HttpResponse, RequestTiming } from '../types';
import { HTTP_DEFAULTS } from '../constants/http-defaults';

export abstract class BaseHttpDriver implements IHttpClient {
  abstract readonly name: string;

  protected getDefaultHeaders(): Record<string, string> {
    return { ...HTTP_DEFAULTS.DEFAULT_HEADERS };
  }

  protected mergeHeaders(
    defaultHeaders: Record<string, string>,
    requestHeaders?: Record<string, string>,
  ): Record<string, string> {
    return { ...defaultHeaders, ...requestHeaders };
  }

  protected buildUrl(baseUrl: string, url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const base = baseUrl.replace(/\/+$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  }

  protected buildQueryString(
    query?: Record<string, string | number | boolean | undefined | null>,
  ): string {
    if (!query) return '';
    const params = Object.entries(query)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  protected collectTiming(): { timing: RequestTiming; stop: () => void } {
    const collector = new RequestTimingCollector();
    const start = collector.start();
    return {
      timing: {
        dns: 0,
        connect: 0,
        tls: 0,
        firstByte: 0,
        total: 0,
      },
      stop: () => {
        const elapsed = start();
        return {
          dns: 0,
          connect: 0,
          tls: 0,
          firstByte: 0,
          total: elapsed,
        };
      },
    };
  }

  abstract request<T = unknown>(options: HttpRequestOptions): Promise<HttpResponse<T>>;

  async get<T = unknown>(
    url: string,
    options?: Partial<HttpRequestOptions>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      ...options,
    });
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    options?: Partial<HttpRequestOptions>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      body: data,
      ...options,
    });
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    options?: Partial<HttpRequestOptions>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      body: data,
      ...options,
    });
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: Partial<HttpRequestOptions>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      body: data,
      ...options,
    });
  }

  async delete<T = unknown>(
    url: string,
    options?: Partial<HttpRequestOptions>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...options,
    });
  }

  async head(
    url: string,
    options?: Partial<HttpRequestOptions>,
  ): Promise<HttpResponse<void>> {
    return this.request<void>({
      method: 'HEAD',
      url,
      ...options,
    });
  }

  abstract healthCheck(): Promise<{ status: 'ok' | 'degraded' | 'unavailable'; latency: number; timestamp: string }>;
}
