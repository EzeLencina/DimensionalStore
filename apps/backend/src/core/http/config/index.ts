import { Injectable, Logger } from '@nestjs/common';
import type { HttpConfiguration, HttpDriverType } from '../types';
import { HTTP_DEFAULTS } from '../constants/http-defaults';
import { HttpConfigurationException } from '../exceptions';

@Injectable()
export class HttpConfigurationFactory {
  private readonly logger = new Logger(HttpConfigurationFactory.name);
  private validated = false;

  validate(): void {
    if (this.validated) return;
    this.getConfiguration();
    this.validated = true;
  }

  getConfiguration(): HttpConfiguration {
    try {
      return this.buildConfiguration();
    } catch (error) {
      throw new HttpConfigurationException(
        'Failed to build HTTP configuration',
        { error: (error as Error).message },
      );
    }
  }

  getDriverType(): HttpDriverType {
    return this.getConfiguration().driver;
  }

  private buildConfiguration(): HttpConfiguration {
    const driver = (process.env['HTTP_DRIVER'] ?? HTTP_DEFAULTS.DRIVER) as HttpDriverType;

    const config: HttpConfiguration = {
      driver,
      baseUrl: process.env['HTTP_BASE_URL'] ?? HTTP_DEFAULTS.BASE_URL,
      timeout: {
        requestTimeout: Number(process.env['HTTP_TIMEOUT'] ?? HTTP_DEFAULTS.TIMEOUT),
        connectTimeout: Number(process.env['HTTP_CONNECT_TIMEOUT'] ?? HTTP_DEFAULTS.CONNECT_TIMEOUT),
        readTimeout: Number(process.env['HTTP_READ_TIMEOUT'] ?? HTTP_DEFAULTS.READ_TIMEOUT),
        writeTimeout: Number(process.env['HTTP_WRITE_TIMEOUT'] ?? HTTP_DEFAULTS.WRITE_TIMEOUT),
      },
      maxRetries: Number(process.env['HTTP_MAX_RETRIES'] ?? HTTP_DEFAULTS.MAX_RETRIES),
      retryDelay: Number(process.env['HTTP_RETRY_DELAY'] ?? HTTP_DEFAULTS.RETRY_DELAY),
      retryStrategy: (process.env['HTTP_RETRY_STRATEGY'] ?? HTTP_DEFAULTS.RETRY_STRATEGY) as HttpConfiguration['retryStrategy'],
      retryJitter: (process.env['HTTP_RETRY_JITTER'] ?? String(HTTP_DEFAULTS.RETRY_JITTER)) === 'true',
      keepAlive: (process.env['HTTP_KEEP_ALIVE'] ?? String(HTTP_DEFAULTS.KEEP_ALIVE)) === 'true',
      maxConnections: Number(process.env['HTTP_MAX_CONNECTIONS'] ?? HTTP_DEFAULTS.MAX_CONNECTIONS),
      dns: {
        cache: (process.env['HTTP_DNS_CACHE'] ?? String(HTTP_DEFAULTS.DNS_CACHE)) === 'true',
        cacheTTL: Number(process.env['HTTP_DNS_CACHE_TTL'] ?? HTTP_DEFAULTS.DNS_CACHE_TTL),
      },
      defaultHeaders: {
        ...HTTP_DEFAULTS.DEFAULT_HEADERS,
        ...this.parseJsonHeader('HTTP_DEFAULT_HEADERS'),
      },
      poolSize: Number(process.env['HTTP_POOL_SIZE'] ?? HTTP_DEFAULTS.POOL_SIZE),
      pipelining: Number(process.env['HTTP_PIPELINING'] ?? HTTP_DEFAULTS.PIPELINING),
      requestTimeout: Number(process.env['HTTP_REQUEST_TIMEOUT'] ?? HTTP_DEFAULTS.TIMEOUT),
    };

    this.logger.log({
      message: 'HTTP configuration built',
      context: 'HttpConfigurationFactory',
      data: { driver, baseUrl: config.baseUrl },
    });

    return config;
  }

  private parseJsonHeader(envKey: string): Record<string, string> {
    const raw = process.env[envKey];
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, string>;
      }
      return {};
    } catch {
      this.logger.warn({
        message: `Invalid JSON in env ${envKey}`,
        context: 'HttpConfigurationFactory',
      });
      return {};
    }
  }
}
