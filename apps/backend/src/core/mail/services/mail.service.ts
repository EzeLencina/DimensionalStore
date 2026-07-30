import { Injectable, Logger } from '@nestjs/common';
import type { IMailProvider } from '../interfaces';
import type {
  SendMailOptions,
  SendMailResult,
  ConnectionHealth,
  MailConfiguration,
} from '../types';
import { MailManagerService } from './mail-manager.service';
import { MailInvalidAddressException } from '../exceptions';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly manager: MailManagerService,
  ) {}

  private get provider(): IMailProvider {
    return this.manager.getProvider();
  }

  getConfig(): MailConfiguration {
    return this.manager.getConfig();
  }

  async send(message: SendMailOptions): Promise<SendMailResult> {
    this.validateAddresses(message);

    return this.provider.send(message);
  }

  async sendBulk(messages: SendMailOptions[]): Promise<SendMailResult[]> {
    const results: SendMailResult[] = [];

    for (const message of messages) {
      try {
        this.validateAddresses(message);
        const result = await this.provider.send(message);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          provider: this.provider.name,
          timestamp: new Date(),
          duration: 0,
          to: Array.isArray(message.to) ? message.to : [message.to],
          subject: message.subject,
          error: (error as Error).message,
        });
      }
    }

    return results;
  }

  async validateConnection(): Promise<ConnectionHealth> {
    return this.provider.validateConnection();
  }

  private validateAddresses(message: SendMailOptions): void {
    const addresses = [
      ...(Array.isArray(message.to) ? message.to : [message.to]),
      ...(message.cc ? (Array.isArray(message.cc) ? message.cc : [message.cc]) : []),
      ...(message.bcc ? (Array.isArray(message.bcc) ? message.bcc : [message.bcc]) : []),
    ].filter(Boolean);

    for (const addr of addresses) {
      if (!this.isValidEmail(addr)) {
        throw new MailInvalidAddressException(
          `Invalid email address: ${addr}`,
          { address: addr },
        );
      }
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
