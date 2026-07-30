import { Provider } from '@nestjs/common';
import { BRAND_REPOSITORY } from '../domain/repository';
import type { BrandRepository } from '../domain/repository';
import { PrismaBrandRepository } from '../infrastructure';
import { BrandAppService } from '../services';

export const BrandRepositoryProvider: Provider<BrandRepository> = {
  provide: BRAND_REPOSITORY,
  useClass: PrismaBrandRepository,
};

export const BRAND_PROVIDERS: Provider[] = [
  BrandRepositoryProvider,
  BrandAppService,
];
