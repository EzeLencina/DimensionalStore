import { Injectable } from '@nestjs/common';
import type { HttpMethod, HttpRequestOptions, HttpResponseType, RetryPolicyConfig } from '../types';
import { HTTP_DEFAULTS } from '../constants/http-defaults';

@Injectable()
export class RequestBuilder {
  private method: HttpMethod = 'GET';
  private url = '';
  private baseUrl?: string;
  private headers: Record<string, string> = {};
  private query: Record<string, string | number | boolean | undefined | null> = {};
  private body?: unknown;
  private timeout?: number;
  private retry?: RetryPolicyConfig;
  private responseType?: HttpResponseType;
  private idempotent?: boolean;
  private metadata: Record<string, unknown> = {};
  private tags: string[] = [];

  setMethod(method: HttpMethod): this {
    this.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  setBaseUrl(baseUrl: string): this {
    this.baseUrl = baseUrl;
    return this;
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    Object.assign(this.headers, headers);
    return this;
  }

  setQuery(key: string, value: string | number | boolean | undefined | null): this {
    this.query[key] = value;
    return this;
  }

  setQueryParams(params: Record<string, string | number | boolean | undefined | null>): this {
    Object.assign(this.query, params);
    return this;
  }

  setBody(body: unknown): this {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  setRetryPolicy(retry: RetryPolicyConfig): this {
    this.retry = retry;
    return this;
  }

  setResponseType(type: HttpResponseType): this {
    this.responseType = type;
    return this;
  }

  setIdempotent(idempotent: boolean): this {
    this.idempotent = idempotent;
    return this;
  }

  setMetadata(key: string, value: unknown): this {
    this.metadata[key] = value;
    return this;
  }

  addTag(tag: string): this {
    this.tags.push(tag);
    return this;
  }

  build(): HttpRequestOptions {
    return {
      method: this.method,
      url: this.url,
      baseUrl: this.baseUrl,
      headers: { ...this.headers },
      query: { ...this.query },
      body: this.body,
      timeout: this.timeout ?? HTTP_DEFAULTS.TIMEOUT,
      retry: this.retry,
      responseType: this.responseType,
      idempotent: this.idempotent ?? this.isIdempotentMethod(),
      metadata: { ...this.metadata },
      tags: [...this.tags],
    };
  }

  reset(): this {
    this.method = 'GET';
    this.url = '';
    this.baseUrl = undefined;
    this.headers = {};
    this.query = {};
    this.body = undefined;
    this.timeout = undefined;
    this.retry = undefined;
    this.responseType = undefined;
    this.idempotent = undefined;
    this.metadata = {};
    this.tags = [];
    return this;
  }

  private isIdempotentMethod(): boolean {
    return ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'].includes(this.method);
  }
}
