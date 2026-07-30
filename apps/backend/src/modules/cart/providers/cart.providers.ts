import { Provider } from '@nestjs/common';
import { CART_REPOSITORY } from '../domain/repository';
import type { CartRepository } from '../domain/repository';
import { PrismaCartRepository } from '../infrastructure';
import { CartAppService } from '../services';

export const CartRepositoryProvider: Provider<CartRepository> = {
  provide: CART_REPOSITORY,
  useClass: PrismaCartRepository,
};

export const CART_PROVIDERS: Provider[] = [
  CartRepositoryProvider,
  CartAppService,
];
