import { Injectable, Logger } from '@nestjs/common';
import type { IStorageDriver } from '../interfaces';
import type { StorageDriverType, StorageDriverConfig } from '../types';
import { StorageConfigurationFactory } from '../config';
import { LocalDriver } from '../drivers/local.driver';
import { S3CompatibleDriver } from '../drivers/s3-compatible.driver';
import { MemoryDriver } from '../drivers/memory.driver';
import { ConfigurationErrorException } from '../exceptions/configuration-error.exception';

@Injectable()
export class StorageDriverFactory {
  private readonly logger = new Logger(StorageDriverFactory.name);

  constructor(
    private readonly configFactory: StorageConfigurationFactory,
    private readonly localDriver: LocalDriver,
    private readonly s3Driver: S3CompatibleDriver,
    private readonly memoryDriver: MemoryDriver,
  ) {}

  createDriver(type?: StorageDriverType): IStorageDriver {
    const driverType = type ?? this.configFactory.getDriverType();

    this.logger.log({
      message: `Creating storage driver: ${driverType}`,
      context: 'StorageDriverFactory',
      data: { driver: driverType },
    });

    switch (driverType) {
      case 'local':
        return this.localDriver;
      case 's3':
        return this.s3Driver;
      case 'memory':
        return this.memoryDriver;
      default:
        throw new ConfigurationErrorException(
          `Unsupported storage driver type: ${driverType as string}`,
          { driver: driverType },
        );
    }
  }
}
