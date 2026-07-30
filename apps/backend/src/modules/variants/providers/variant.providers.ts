import { Provider } from '@nestjs/common';
import { VARIANT_REPOSITORY } from '../domain/repository';
import type { VariantRepository } from '../domain/repository';
import { PrismaVariantRepository } from '../infrastructure';
import { VariantAppService } from '../services';

export const VariantRepositoryProvider: Provider<VariantRepository> = {
  provide: VARIANT_REPOSITORY,
  useClass: PrismaVariantRepository,
};

export const VARIANT_PROVIDERS: Provider[] = [
  VariantRepositoryProvider,
  VariantAppService,
];
