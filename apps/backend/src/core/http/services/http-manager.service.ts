import { Injectable, Logger } from '@nestjs/common';
import type { IHttpManager, IHttpClient } from '../interfaces';
import type { HttpConfiguration, HttpDriverType } from '../types';
import { HttpConfigurationFactory } from '../config';
import { HttpDriverFactory } from '../factory';

@Injectable()
export class HttpManagerService implements IHttpManager {
  private currentClient: IHttpClient;
  private readonly logger = new Logger(HttpManagerService.name);

  constructor(
    private readonly configFactory: HttpConfigurationFactory,
    private readonly driverFactory: HttpDriverFactory,
  ) {
    this.configFactory.validate();
    this.currentClient = this.driverFactory.createDriver();
    this.logger.log({
      message: `HttpManager initialized with driver: ${this.currentClient.name}`,
      context: 'HttpManagerService',
    });
  }

  getClient(): IHttpClient {
    return this.currentClient;
  }

  getDriverType(): HttpDriverType {
    return this.configFactory.getDriverType();
  }

  getConfig(): HttpConfiguration {
    return this.configFactory.getConfiguration();
  }

  switchDriver(type: HttpDriverType): IHttpClient {
    if (type === this.currentClient.name as HttpDriverType) {
      return this.currentClient;
    }

    this.currentClient = this.driverFactory.createDriver(type);

    this.logger.log({
      message: `Switched HTTP driver to: ${type}`,
      context: 'HttpManagerService',
      data: { driver: type },
    });

    return this.currentClient;
  }
}
