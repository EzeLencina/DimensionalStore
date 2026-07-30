import { Injectable, Logger } from '@nestjs/common';
import { HttpCircuitOpenException } from '../../exceptions';

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreaker {
  readonly state: CircuitState;
  call<T>(operation: () => Promise<T>): Promise<T>;
  reset(): void;
}

@Injectable()
export class DefaultCircuitBreaker implements CircuitBreaker {
  private _state: CircuitState = 'closed';
  private failureCount = 0;
  private readonly failureThreshold: number;
  private readonly halfOpenMaxRequests: number;
  private halfOpenRequests = 0;
  private readonly resetTimeoutMs: number;
  private lastFailureTime = 0;
  private readonly logger = new Logger(DefaultCircuitBreaker.name);

  constructor() {
    this.failureThreshold = 5;
    this.resetTimeoutMs = 30_000;
    this.halfOpenMaxRequests = 3;
  }

  get state(): CircuitState {
    return this._state;
  }

  async call<T>(operation: () => Promise<T>): Promise<T> {
    if (this._state === 'open') {
      if (this.shouldAttemptReset()) {
        this.transitionToHalfOpen();
      } else {
        throw new HttpCircuitOpenException(
          'Circuit breaker is open',
          { state: 'open', failureCount: this.failureCount },
        );
      }
    }

    if (this._state === 'half-open' && this.halfOpenRequests >= this.halfOpenMaxRequests) {
      throw new HttpCircuitOpenException(
        'Circuit breaker half-open max requests reached',
        { state: 'half-open', halfOpenRequests: this.halfOpenRequests },
      );
    }

    this.halfOpenRequests++;

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  reset(): void {
    this._state = 'closed';
    this.failureCount = 0;
    this.halfOpenRequests = 0;
    this.lastFailureTime = 0;
  }

  private onSuccess(): void {
    if (this._state === 'half-open') {
      this.logger.log({
        message: 'Circuit breaker closed after successful half-open request',
        context: 'DefaultCircuitBreaker',
      });
      this.reset();
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this._state === 'half-open' || this.failureCount >= this.failureThreshold) {
      this.transitionToOpen();
    }
  }

  private transitionToOpen(): void {
    this._state = 'open';
    this.logger.warn({
      message: `Circuit breaker opened after ${this.failureCount} failures`,
      context: 'DefaultCircuitBreaker',
      data: { failures: this.failureCount },
    });
  }

  private transitionToHalfOpen(): void {
    this._state = 'half-open';
    this.halfOpenRequests = 0;
    this.logger.log({
      message: 'Circuit breaker half-open, allowing test requests',
      context: 'DefaultCircuitBreaker',
    });
  }

  private shouldAttemptReset(): boolean {
    return Date.now() - this.lastFailureTime >= this.resetTimeoutMs;
  }
}
