import { Injectable, Logger } from '@nestjs/common';
import type { IStorageManager, IStorageDriver } from '../interfaces';
import type { StorageDriverType, StorageDriverConfig } from '../types';
import { StorageConfigurationFactory } from '../config';
import { StorageDriverFactory } from '../factory';
import { ConfigurationErrorException } from '../exceptions';

@Injectable()
export class StorageManagerService implements IStorageManager {
  private currentDriver: IStorageDriver;
  private readonly logger = new Logger(StorageManagerService.name);

  constructor(
    private readonly configFactory: StorageConfigurationFactory,
    private readonly driverFactory: StorageDriverFactory,
  ) {
    this.configFactory.validate();
    this.currentDriver = this.driverFactory.createDriver();
    this.logger.log({
      message: `StorageManager initialized with driver: ${this.currentDriver.name}`,
      context: 'StorageManagerService',
    });
  }

  getDriver(): IStorageDriver {
    return this.currentDriver;
  }

  getDriverType(): StorageDriverType {
    return this.configFactory.getDriverType();
  }

  getConfig(): StorageDriverConfig {
    return this.configFactory.getConfiguration();
  }

  switchDriver(type: StorageDriverType, _config?: Partial<StorageDriverConfig>): IStorageDriver {
    if (type === this.currentDriver.name as StorageDriverType) {
      return this.currentDriver;
    }

    this.currentDriver = this.driverFactory.createDriver(type);

    this.logger.log({
      message: `Switched storage driver to: ${type}`,
      context: 'StorageManagerService',
      data: { driver: type },
    });

    return this.currentDriver;
  }
}
