import { Injectable, Logger } from '@nestjs/common';
import type { IMailProvider } from '../interfaces';
import type {
  SendMailOptions,
  SendMailResult,
  ConnectionHealth,
} from '../types';

@Injectable()
export class LogDriver implements IMailProvider {
  readonly name = 'log';

  private readonly logger = new Logger(LogDriver.name);

  async send(message: SendMailOptions): Promise<SendMailResult> {
    const start = Date.now();
    const to = Array.isArray(message.to) ? message.to : [message.to];

    this.logger.log({
      message: `[LOG DRIVER] Email would be sent`,
      context: 'LogDriver',
      data: {
        to,
        subject: message.subject,
        cc: message.cc,
        bcc: message.bcc,
        hasHtml: !!message.html,
        hasText: !!message.text,
        attachments: message.attachments?.length ?? 0,
        priority: message.priority,
      },
    });

    const duration = Date.now() - start;

    return {
      success: true,
      messageId: `log-${Date.now()}`,
      provider: this.name,
      timestamp: new Date(),
      duration,
      to,
      subject: message.subject,
    };
  }

  async sendBulk(messages: SendMailOptions[]): Promise<SendMailResult[]> {
    return Promise.all(messages.map((msg) => this.send(msg)));
  }

  async validateConnection(): Promise<ConnectionHealth> {
    return {
      status: 'healthy',
      latency: 0,
      provider: this.name,
    };
  }
}
