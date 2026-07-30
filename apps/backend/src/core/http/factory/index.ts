import { Injectable, Logger } from '@nestjs/common';
import type { IHttpClient } from '../interfaces';
import type { HttpDriverType } from '../types';
import { HttpConfigurationFactory } from '../config';
import { UndiciDriver, AxiosDriver, GotDriver } from '../drivers';
import { HttpConfigurationException } from '../exceptions';

@Injectable()
export class HttpDriverFactory {
  private readonly logger = new Logger(HttpDriverFactory.name);

  constructor(
    private readonly configFactory: HttpConfigurationFactory,
    private readonly undiciDriver: UndiciDriver,
    private readonly axiosDriver: AxiosDriver,
    private readonly gotDriver: GotDriver,
  ) {}

  createDriver(type?: HttpDriverType): IHttpClient {
    const driverType = type ?? this.configFactory.getDriverType();

    this.logger.log({
      message: `Creating HTTP driver: ${driverType}`,
      context: 'HttpDriverFactory',
      data: { driver: driverType },
    });

    switch (driverType) {
      case 'undici':
        return this.undiciDriver;
      case 'axios':
        return this.axiosDriver;
      case 'got':
        return this.gotDriver;
      default:
        throw new HttpConfigurationException(
          `Unsupported HTTP driver type: ${driverType as string}`,
          { driver: driverType },
        );
    }
  }
}
