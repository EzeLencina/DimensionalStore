import { Injectable } from '@nestjs/common';
import { BaseHttpDriver } from './base-driver';
import type { HttpRequestOptions, HttpResponse, HealthCheckResponse } from '../types';
import { HttpDriverUnavailableException } from '../exceptions';

@Injectable()
export class AxiosDriver extends BaseHttpDriver {
  readonly name = 'axios';

  request<T = unknown>(_options: HttpRequestOptions): Promise<HttpResponse<T>> {
    throw new HttpDriverUnavailableException(
      'Axios driver is not yet implemented',
      { driver: 'axios' },
    );
  }

  healthCheck(): Promise<HealthCheckResponse> {
    throw new HttpDriverUnavailableException(
      'Axios driver is not yet implemented',
      { driver: 'axios' },
    );
  }
}
