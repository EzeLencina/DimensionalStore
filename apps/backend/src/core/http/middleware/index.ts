import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { HttpRequestOptions } from '../types';

export interface HttpMiddleware {
  process(options: HttpRequestOptions): HttpRequestOptions;
}

@Injectable()
export class CorrelationIdMiddleware implements HttpMiddleware {
  private readonly headerName = 'x-correlation-id';

  process(options: HttpRequestOptions): HttpRequestOptions {
    const headers = { ...options.headers };

    if (!headers[this.headerName]) {
      headers[this.headerName] = randomUUID();
    }

    return { ...options, headers };
  }
}

@Injectable()
export class RequestIdMiddleware implements HttpMiddleware {
  private readonly headerName = 'x-request-id';

  process(options: HttpRequestOptions): HttpRequestOptions {
    const headers = { ...options.headers };

    if (!headers[this.headerName]) {
      headers[this.headerName] = randomUUID();
    }

    return { ...options, headers };
  }
}

export class CommonHeadersMiddleware implements HttpMiddleware {
  private readonly headers: Record<string, string>;

  constructor(headers: Record<string, string>) {
    this.headers = { ...headers };
  }

  process(options: HttpRequestOptions): HttpRequestOptions {
    return {
      ...options,
      headers: { ...this.headers, ...options.headers },
    };
  }
}
