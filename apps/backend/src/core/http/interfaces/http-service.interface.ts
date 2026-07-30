import type { HttpRequestOptions, HttpResponse } from '../types';

export interface IHttpService {
  request<T = unknown>(options: HttpRequestOptions): Promise<HttpResponse<T>>;

  get<T = unknown>(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  post<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  put<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  patch<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  delete<T = unknown>(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>>;

  head(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<void>>;
}
