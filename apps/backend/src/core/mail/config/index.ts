import { Injectable } from '@nestjs/common';
import { mailConfig } from '@tienda/config';
import { MAIL_DEFAULTS } from '../constants/mail-defaults';
import { MailConfigurationException } from '../exceptions';
import type { MailProviderType, MailConfiguration } from '../types';

@Injectable()
export class MailConfigurationFactory {
  private readonly config: MailConfiguration;

  constructor() {
    const cfg = mailConfig();

    this.config = {
      driver: this.resolveDriverType(),
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      pass: cfg.pass,
      fromAddress: process.env['MAIL_FROM_ADDRESS'] ?? MAIL_DEFAULTS.FROM_ADDRESS,
      fromName: process.env['MAIL_FROM_NAME'] ?? MAIL_DEFAULTS.FROM_NAME,
      replyTo: process.env['MAIL_REPLY_TO'],
      tls: this.parseBool(process.env['MAIL_TLS'], MAIL_DEFAULTS.TLS),
      timeout: this.parseNum(process.env['MAIL_TIMEOUT'], MAIL_DEFAULTS.TIMEOUT),
      maxConnections: this.parseNum(process.env['MAIL_MAX_CONNECTIONS'], MAIL_DEFAULTS.MAX_CONNECTIONS),
      pool: this.parseBool(process.env['MAIL_POOL'], MAIL_DEFAULTS.POOL),
      retryAttempts: this.parseNum(process.env['MAIL_RETRY_ATTEMPTS'], MAIL_DEFAULTS.RETRY_ATTEMPTS),
      retryDelay: this.parseNum(process.env['MAIL_RETRY_DELAY'], MAIL_DEFAULTS.RETRY_DELAY),
      rateLimit: this.parseNum(process.env['MAIL_RATE_LIMIT'], MAIL_DEFAULTS.RATE_LIMIT),
      rateLimitInterval: this.parseNum(process.env['MAIL_RATE_LIMIT_INTERVAL'], MAIL_DEFAULTS.RATE_LIMIT_INTERVAL),
      apiKey: process.env['MAIL_API_KEY'],
      region: process.env['MAIL_REGION'],
    };
  }

  getConfiguration(): MailConfiguration {
    return { ...this.config };
  }

  getProviderType(): MailProviderType {
    return this.config.driver;
  }

  validate(): void {
    const cfg = this.config;

    if (cfg.driver === 'smtp') {
      if (!cfg.host) {
        throw new MailConfigurationException('SMTP host is required');
      }
      if (!cfg.port || cfg.port < 1 || cfg.port > 65535) {
        throw new MailConfigurationException('SMTP port is invalid');
      }
    }

    if (cfg.driver !== 'log' && !cfg.fromAddress) {
      throw new MailConfigurationException('From address is required');
    }
  }

  private resolveDriverType(): MailProviderType {
    const env = process.env['MAIL_DRIVER'];
    if (env === 'smtp' || env === 'ses' || env === 'sendgrid' || env === 'mailgun' || env === 'resend' || env === 'log') {
      return env;
    }
    return 'log';
  }

  private parseBool(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  private parseNum(value: string | undefined, defaultValue: number): number {
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
}
