import { Injectable, Logger } from '@nestjs/common';
import type { IMailProvider } from '../interfaces';
import type {
  SendMailOptions,
  SendMailResult,
  ConnectionHealth,
} from '../types';
import { MailProviderUnavailableException } from '../exceptions';

@Injectable()
export class ResendDriver implements IMailProvider {
  readonly name = 'resend';

  private readonly logger = new Logger(ResendDriver.name);

  async send(_message: SendMailOptions): Promise<SendMailResult> {
    throw new MailProviderUnavailableException(
      'Resend driver not implemented. Awaiting Resend SDK integration in future phase.',
    );
  }

  async sendBulk(_messages: SendMailOptions[]): Promise<SendMailResult[]> {
    throw new MailProviderUnavailableException(
      'Resend driver not implemented. Awaiting Resend SDK integration in future phase.',
    );
  }

  async validateConnection(): Promise<ConnectionHealth> {
    return {
      status: 'unhealthy',
      latency: 0,
      provider: this.name,
      error: 'Resend driver not implemented.',
    };
  }
}
