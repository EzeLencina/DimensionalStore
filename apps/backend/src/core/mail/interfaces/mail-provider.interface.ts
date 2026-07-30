import type {
  SendMailOptions,
  SendMailResult,
  ConnectionHealth,
} from '../types';

export interface IMailProvider {
  readonly name: string;

  send(message: SendMailOptions): Promise<SendMailResult>;

  sendBulk(messages: SendMailOptions[]): Promise<SendMailResult[]>;

  validateConnection(): Promise<ConnectionHealth>;
}
