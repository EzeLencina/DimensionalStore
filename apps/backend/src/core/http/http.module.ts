import { Global, Module } from '@nestjs/common';
import { HttpConfigurationFactory } from './config';
import { HttpDriverFactory } from './factory';
import { UndiciDriver, AxiosDriver, GotDriver } from './drivers';
import { HttpManagerService, HttpService } from './services';
import { HttpClient } from './client';
import { RequestBuilder } from './builders';
import { CorrelationIdMiddleware, RequestIdMiddleware } from './middleware';
import { LoggingInterceptor, TracingInterceptor } from './interceptors';
import { JsonSerializer } from './serializers';
import { ResponseDeserializer } from './deserializers';
import { DefaultRetryPolicy, DefaultTimeoutPolicy, DefaultCircuitBreaker } from './policies';
import { HttpHealthService } from './health';
import { httpClientProvider } from './providers';

@Global()
@Module({
  providers: [
    HttpConfigurationFactory,
    HttpDriverFactory,
    UndiciDriver,
    AxiosDriver,
    GotDriver,
    HttpManagerService,
    HttpService,
    HttpClient,
    RequestBuilder,
    CorrelationIdMiddleware,
    RequestIdMiddleware,
    LoggingInterceptor,
    TracingInterceptor,
    JsonSerializer,
    ResponseDeserializer,
    DefaultRetryPolicy,
    DefaultTimeoutPolicy,
    DefaultCircuitBreaker,
    HttpHealthService,
    httpClientProvider,
  ],
  exports: [
    HttpConfigurationFactory,
    HttpDriverFactory,
    HttpManagerService,
    HttpService,
    HttpClient,
    RequestBuilder,
    CorrelationIdMiddleware,
    RequestIdMiddleware,
    LoggingInterceptor,
    TracingInterceptor,
    JsonSerializer,
    ResponseDeserializer,
    DefaultRetryPolicy,
    DefaultTimeoutPolicy,
    DefaultCircuitBreaker,
    HttpHealthService,
  ],
})
export class HttpModule {}
