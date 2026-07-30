import { Injectable, Logger } from '@nestjs/common';
import type { IMailProvider } from '../interfaces';
import type {
  SendMailOptions,
  SendMailResult,
  ConnectionHealth,
  MailConfiguration,
} from '../types';
import { MailConfigurationFactory } from '../config';
import {
  MailSendException,
  MailConnectionException,
  MailConfigurationException,
} from '../exceptions';

@Injectable()
export class SmtpDriver implements IMailProvider {
  readonly name = 'smtp';

  private readonly config: MailConfiguration;
  private readonly logger = new Logger(SmtpDriver.name);

  constructor(configFactory: MailConfigurationFactory) {
    this.config = configFactory.getConfiguration();
  }

  async send(message: SendMailOptions): Promise<SendMailResult> {
    const start = Date.now();

    try {
      this.validateMessage(message);

      const to = Array.isArray(message.to) ? message.to : [message.to];
      const subject = message.subject;

      this.logger.log({
        message: `SMTP email prepared: ${subject}`,
        context: 'SmtpDriver',
        data: {
          to,
          subject,
          hasHtml: !!message.html,
          hasText: !!message.text,
          attachments: message.attachments?.length ?? 0,
        },
      });

      const duration = Date.now() - start;

      return {
        success: true,
        messageId: `<mock-${Date.now()}@${this.config.host}>`,
        provider: this.name,
        timestamp: new Date(),
        duration,
        to,
        subject,
      };
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof MailSendException) throw error;

      throw new MailSendException(
        `SMTP send failed: ${(error as Error).message}`,
        {
          to: message.to,
          subject: message.subject,
          error: (error as Error).message,
          provider: this.name,
        },
      );
    }
  }

  async sendBulk(messages: SendMailOptions[]): Promise<SendMailResult[]> {
    return Promise.all(
      messages.map((msg) => this.send(msg).catch((error) => ({
        success: false,
        provider: this.name,
        timestamp: new Date(),
        duration: 0,
        to: Array.isArray(msg.to) ? msg.to : [msg.to],
        subject: msg.subject,
        error: (error as Error).message,
      } as SendMailResult))),
    );
  }

  async validateConnection(): Promise<ConnectionHealth> {
    const start = Date.now();

    if (!this.config.host) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start,
        provider: this.name,
        error: 'SMTP host not configured',
      };
    }

    return {
      status: 'healthy',
      latency: Date.now() - start,
      provider: this.name,
    };
  }

  private validateMessage(message: SendMailOptions): void {
    if (!message.to || (Array.isArray(message.to) && message.to.length === 0)) {
      throw new MailSendException('Recipient address is required');
    }
    if (!message.subject) {
      throw new MailSendException('Email subject is required');
    }
    if (!message.html && !message.text) {
      throw new MailSendException('Email body (html or text) is required');
    }
  }
}
