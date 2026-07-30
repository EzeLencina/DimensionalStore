import { Injectable, Logger } from '@nestjs/common';
import type { IMailProvider } from '../interfaces';
import type {
  SendMailOptions,
  SendMailResult,
  ConnectionHealth,
} from '../types';
import { MailProviderUnavailableException } from '../exceptions';

@Injectable()
export class SesDriver implements IMailProvider {
  readonly name = 'ses';

  private readonly logger = new Logger(SesDriver.name);

  async send(_message: SendMailOptions): Promise<SendMailResult> {
    throw new MailProviderUnavailableException(
      'Amazon SES driver not implemented. Awaiting AWS SDK integration in future phase.',
    );
  }

  async sendBulk(_messages: SendMailOptions[]): Promise<SendMailResult[]> {
    throw new MailProviderUnavailableException(
      'Amazon SES driver not implemented. Awaiting AWS SDK integration in future phase.',
    );
  }

  async validateConnection(): Promise<ConnectionHealth> {
    return {
      status: 'unhealthy',
      latency: 0,
      provider: this.name,
      error: 'Amazon SES driver not implemented.',
    };
  }
}
