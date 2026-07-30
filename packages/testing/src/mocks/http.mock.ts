import type { MockHttpResponse } from '../types';

export class HttpMockServer {
  private handlers: Map<string, Map<string, MockHttpResponse>> = new Map();
  private requestLog: Array<{ method: string; url: string; body?: unknown; headers?: Record<string, string> }> = [];

  on(method: string, url: string, response: MockHttpResponse): void {
    if (!this.handlers.has(method.toUpperCase())) {
      this.handlers.set(method.toUpperCase(), new Map());
    }
    this.handlers.get(method.toUpperCase())!.set(url, response);
  }

  onGet(url: string, response: MockHttpResponse): void {
    this.on('GET', url, response);
  }

  onPost(url: string, response: MockHttpResponse): void {
    this.on('POST', url, response);
  }

  onPut(url: string, response: MockHttpResponse): void {
    this.on('PUT', url, response);
  }

  onPatch(url: string, response: MockHttpResponse): void {
    this.on('PATCH', url, response);
  }

  onDelete(url: string, response: MockHttpResponse): void {
    this.on('DELETE', url, response);
  }

  async request<T = unknown>(
    method: string,
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<MockHttpResponse<T>> {
    const methodHandlers = this.handlers.get(method.toUpperCase());
    if (!methodHandlers) {
      return { status: 404, headers: {}, body: { error: 'Not found' } as T };
    }

    const response = methodHandlers.get(url);
    if (!response) {
      return { status: 404, headers: {}, body: { error: 'Not found' } as T };
    }

    this.requestLog.push({ method, url, body, headers });

    if (response.delay) {
      await new Promise(resolve => setTimeout(resolve, response.delay));
    }

    if (response.body && typeof response.body === 'object') {
      return response as MockHttpResponse<T>;
    }

    return {
      status: response.status,
      headers: response.headers,
      body: response.body as T,
    };
  }

  getRequestLog(): Array<{ method: string; url: string; body?: unknown; headers?: Record<string, string> }> {
    return [...this.requestLog];
  }

  clearLog(): void {
    this.requestLog = [];
  }

  reset(): void {
    this.handlers.clear();
    this.requestLog = [];
  }
}

export const httpMockServer = new HttpMockServer();
