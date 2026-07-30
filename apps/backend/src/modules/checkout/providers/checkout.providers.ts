import { Provider } from '@nestjs/common';
import { CHECKOUT_REPOSITORY, ORDER_REPOSITORY, IDEMPOTENCY_REPOSITORY } from '../domain/repository';
import type { CheckoutRepository, OrderRepository, IdempotencyRepository } from '../domain/repository';
import { PrismaCheckoutSessionRepository, PrismaOrderRepository, PrismaIdempotencyRepository } from '../infrastructure';
import { CheckoutAppService } from '../services';

export const CheckoutRepositoryProvider: Provider<CheckoutRepository> = { provide: CHECKOUT_REPOSITORY, useClass: PrismaCheckoutSessionRepository };
export const OrderRepositoryProvider: Provider<OrderRepository> = { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository };
export const IdempotencyRepositoryProvider: Provider<IdempotencyRepository> = { provide: IDEMPOTENCY_REPOSITORY, useClass: PrismaIdempotencyRepository };

export const CHECKOUT_PROVIDERS: Provider[] = [
  CheckoutRepositoryProvider, OrderRepositoryProvider, IdempotencyRepositoryProvider,
  CheckoutAppService,
];
