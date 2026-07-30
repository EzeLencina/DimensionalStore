import { Injectable, Logger } from '@nestjs/common';
import type { IMailManager, IMailProvider } from '../interfaces';
import type { MailProviderType, MailConfiguration } from '../types';
import { MailConfigurationFactory } from '../config';
import { MailDriverFactory } from '../factory';

@Injectable()
export class MailManagerService implements IMailManager {
  private currentProvider: IMailProvider;
  private readonly logger = new Logger(MailManagerService.name);

  constructor(
    private readonly configFactory: MailConfigurationFactory,
    private readonly driverFactory: MailDriverFactory,
  ) {
    this.configFactory.validate();
    this.currentProvider = this.driverFactory.createDriver();
    this.logger.log({
      message: `MailManager initialized with provider: ${this.currentProvider.name}`,
      context: 'MailManagerService',
    });
  }

  getProvider(): IMailProvider {
    return this.currentProvider;
  }

  getProviderName(): MailProviderType {
    return this.configFactory.getProviderType();
  }

  getConfig(): MailConfiguration {
    return this.configFactory.getConfiguration();
  }

  switchProvider(type: MailProviderType): IMailProvider {
    if (type === this.currentProvider.name as MailProviderType) {
      return this.currentProvider;
    }

    this.currentProvider = this.driverFactory.createDriver(type);

    this.logger.log({
      message: `Switched mail provider to: ${type}`,
      context: 'MailManagerService',
      data: { provider: type },
    });

    return this.currentProvider;
  }
}
