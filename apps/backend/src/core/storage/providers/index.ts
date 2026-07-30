import { FactoryProvider } from '@nestjs/common';
import { STORAGE_TOKENS } from '../constants/storage-tokens';
import { StorageConfigurationFactory } from '../config';
import { StorageDriverFactory } from '../factory';
import { StorageManagerService } from '../services/storage-manager.service';

export const storageConfigProvider = {
  provide: STORAGE_TOKENS.CONFIG,
  useClass: StorageConfigurationFactory,
};

export const storageDriverProvider: FactoryProvider = {
  provide: STORAGE_TOKENS.DRIVER,
  useFactory: (manager: StorageManagerService) => manager.getDriver(),
  inject: [StorageManagerService],
};
