import { Injectable, Logger } from '@nestjs/common';
import type { IMailProvider } from '../interfaces';
import type {
  SendMailOptions,
  SendMailResult,
  ConnectionHealth,
} from '../types';
import { MailProviderUnavailableException } from '../exceptions';

@Injectable()
export class MailgunDriver implements IMailProvider {
  readonly name = 'mailgun';

  private readonly logger = new Logger(MailgunDriver.name);

  async send(_message: SendMailOptions): Promise<SendMailResult> {
    throw new MailProviderUnavailableException(
      'Mailgun driver not implemented. Awaiting Mailgun SDK integration in future phase.',
    );
  }

  async sendBulk(_messages: SendMailOptions[]): Promise<SendMailResult[]> {
    throw new MailProviderUnavailableException(
      'Mailgun driver not implemented. Awaiting Mailgun SDK integration in future phase.',
    );
  }

  async validateConnection(): Promise<ConnectionHealth> {
    return {
      status: 'unhealthy',
      latency: 0,
      provider: this.name,
      error: 'Mailgun driver not implemented.',
    };
  }
}
