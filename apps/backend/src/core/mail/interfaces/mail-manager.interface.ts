import type { IMailProvider } from './mail-provider.interface';
import type { MailProviderType, MailConfiguration } from '../types';

export interface IMailManager {
  getProvider(): IMailProvider;
  getProviderName(): MailProviderType;
  getConfig(): MailConfiguration;
  switchProvider(type: MailProviderType): IMailProvider;
}
