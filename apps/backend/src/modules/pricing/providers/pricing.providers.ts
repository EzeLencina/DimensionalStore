import { Provider } from '@nestjs/common';
import { PRICE_LIST_REPOSITORY, VARIANT_PRICE_REPOSITORY, PRICE_HISTORY_REPOSITORY } from '../domain/repository';
import type { PriceListRepository, VariantPriceRepository, PriceHistoryRepository } from '../domain/repository';
import { PrismaPriceListRepository, PrismaVariantPriceRepository, PrismaPriceHistoryRepository } from '../infrastructure';
import { PriceListAppService, VariantPriceAppService, PricingAppService } from '../services';

export const PriceListRepositoryProvider: Provider<PriceListRepository> = {
  provide: PRICE_LIST_REPOSITORY,
  useClass: PrismaPriceListRepository,
};

export const VariantPriceRepositoryProvider: Provider<VariantPriceRepository> = {
  provide: VARIANT_PRICE_REPOSITORY,
  useClass: PrismaVariantPriceRepository,
};

export const PriceHistoryRepositoryProvider: Provider<PriceHistoryRepository> = {
  provide: PRICE_HISTORY_REPOSITORY,
  useClass: PrismaPriceHistoryRepository,
};

export const PRICING_PROVIDERS: Provider[] = [
  PriceListRepositoryProvider,
  VariantPriceRepositoryProvider,
  PriceHistoryRepositoryProvider,
  PriceListAppService,
  VariantPriceAppService,
  PricingAppService,
];
