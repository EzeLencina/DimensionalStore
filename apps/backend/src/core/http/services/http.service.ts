import { Injectable } from '@nestjs/common';
import type { IHttpService } from '../interfaces';
import type { HttpRequestOptions, HttpResponse } from '../types';
import { HttpManagerService } from './http-manager.service';

@Injectable()
export class HttpService implements IHttpService {
  constructor(private readonly manager: HttpManagerService) {}

  request<T = unknown>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    return this.manager.getClient().request<T>(options);
  }

  get<T = unknown>(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>> {
    return this.manager.getClient().get<T>(url, options);
  }

  post<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>> {
    return this.manager.getClient().post<T>(url, data, options);
  }

  put<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>> {
    return this.manager.getClient().put<T>(url, data, options);
  }

  patch<T = unknown>(url: string, data?: unknown, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>> {
    return this.manager.getClient().patch<T>(url, data, options);
  }

  delete<T = unknown>(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<T>> {
    return this.manager.getClient().delete<T>(url, options);
  }

  head(url: string, options?: Partial<HttpRequestOptions>): Promise<HttpResponse<void>> {
    return this.manager.getClient().head(url, options);
  }
}
