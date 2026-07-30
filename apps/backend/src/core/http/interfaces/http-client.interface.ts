import type { HttpRequestOptions, HttpResponse, HealthCheckResponse } from '../types';

export interface IHttpClient {
  readonly name: string;

  request<T = unknown>(options: HttpRequestOptions): Promise<HttpResponse<T>>;

  get<T = unknown>(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  post<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  put<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  patch<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  delete<T = unknown>(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  head(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<void>>;

  healthCheck(): Promise<HealthCheckResponse>;
}
