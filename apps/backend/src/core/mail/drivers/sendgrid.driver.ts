import { Injectable, Logger } from '@nestjs/common';
import type { IMailProvider } from '../interfaces';
import type {
  SendMailOptions,
  SendMailResult,
  ConnectionHealth,
} from '../types';
import { MailProviderUnavailableException } from '../exceptions';

@Injectable()
export class SendgridDriver implements IMailProvider {
  readonly name = 'sendgrid';

  private readonly logger = new Logger(SendgridDriver.name);

  async send(_message: SendMailOptions): Promise<SendMailResult> {
    throw new MailProviderUnavailableException(
      'SendGrid driver not implemented. Awaiting SendGrid SDK integration in future phase.',
    );
  }

  async sendBulk(_messages: SendMailOptions[]): Promise<SendMailResult[]> {
    throw new MailProviderUnavailableException(
      'SendGrid driver not implemented. Awaiting SendGrid SDK integration in future phase.',
    );
  }

  async validateConnection(): Promise<ConnectionHealth> {
    return {
      status: 'unhealthy',
      latency: 0,
      provider: this.name,
      error: 'SendGrid driver not implemented.',
    };
  }
}
