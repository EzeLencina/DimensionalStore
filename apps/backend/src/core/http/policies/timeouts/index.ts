import { Injectable } from '@nestjs/common';
import type { TimeoutConfig } from '../../types';
import { HTTP_DEFAULTS } from '../../constants/http-defaults';

export interface TimeoutPolicy {
  getConfig(): TimeoutConfig;
  createSignal(timeout?: number): AbortSignal;
  createTimeoutPromise<T>(promise: Promise<T>, timeout?: number): Promise<T>;
}

@Injectable()
export class DefaultTimeoutPolicy implements TimeoutPolicy {
  private readonly config: TimeoutConfig;

  constructor() {
    this.config = {
      requestTimeout: HTTP_DEFAULTS.TIMEOUT,
      connectTimeout: HTTP_DEFAULTS.CONNECT_TIMEOUT,
      readTimeout: HTTP_DEFAULTS.READ_TIMEOUT,
      writeTimeout: HTTP_DEFAULTS.WRITE_TIMEOUT,
    };
  }

  getConfig(): TimeoutConfig {
    return { ...this.config };
  }

  createSignal(timeout?: number): AbortSignal {
    return AbortSignal.timeout(timeout ?? this.config.requestTimeout);
  }

  createTimeoutPromise<T>(promise: Promise<T>, timeout?: number): Promise<T> {
    const ms = timeout ?? this.config.requestTimeout;

    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Request timed out after ${ms}ms`));
      }, ms);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timer));
    });
  }
}
