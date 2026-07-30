import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class TestRequestHelper {
  constructor(private readonly app: INestApplication) {}

  get(url: string): request.Test {
    return request(this.app.getHttpServer()).get(url);
  }

  post(url: string): request.Test {
    return request(this.app.getHttpServer()).post(url);
  }

  put(url: string): request.Test {
    return request(this.app.getHttpServer()).put(url);
  }

  patch(url: string): request.Test {
    return request(this.app.getHttpServer()).patch(url);
  }

  delete(url: string): request.Test {
    return request(this.app.getHttpServer()).delete(url);
  }

  createAuthenticatedRequest(token: string): {
    get: (url: string) => request.Test;
    post: (url: string) => request.Test;
    put: (url: string) => request.Test;
    patch: (url: string) => request.Test;
    delete: (url: string) => request.Test;
  } {
    const authHeader = `Bearer ${token}`;
    return {
      get: (url: string) => this.get(url).set('Authorization', authHeader),
      post: (url: string) => this.post(url).set('Authorization', authHeader),
      put: (url: string) => this.put(url).set('Authorization', authHeader),
      patch: (url: string) => this.patch(url).set('Authorization', authHeader),
      delete: (url: string) => this.delete(url).set('Authorization', authHeader),
    };
  }
}

export function createTestHeaders(overrides?: Record<string, string>): Record<string, string> {
  return {
    'x-request-id': 'test-request-id',
    'x-correlation-id': 'test-correlation-id',
    'content-type': 'application/json',
    ...overrides,
  };
}
