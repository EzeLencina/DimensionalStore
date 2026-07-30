import { Injectable } from '@nestjs/common';
import { BaseHttpDriver } from './base-driver';
import type { HttpRequestOptions, HttpResponse, HealthCheckResponse } from '../types';
import { HttpDriverUnavailableException } from '../exceptions';

@Injectable()
export class GotDriver extends BaseHttpDriver {
  readonly name = 'got';

  request<T = unknown>(_options: HttpRequestOptions): Promise<HttpResponse<T>> {
    throw new HttpDriverUnavailableException(
      'Got driver is not yet implemented',
      { driver: 'got' },
    );
  }

  healthCheck(): Promise<HealthCheckResponse> {
    throw new HttpDriverUnavailableException(
      'Got driver is not yet implemented',
      { driver: 'got' },
    );
  }
}
