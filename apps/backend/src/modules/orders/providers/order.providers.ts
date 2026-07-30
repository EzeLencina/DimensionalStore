import { Provider } from '@nestjs/common';
import { ORDER_REPOSITORY, ORDER_STATUS_HISTORY_REPOSITORY, ORDER_NOTE_REPOSITORY, ORDER_CANCELLATION_REPOSITORY } from '../domain/repositories';
import { PrismaOrderRepository, PrismaOrderStatusHistoryRepository, PrismaOrderNoteRepository, PrismaOrderCancellationRepository } from '../infrastructure';
import { OrderAppService } from '../services';

export const OrderRepositoryProvider: Provider = { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository };
export const OrderHistoryRepositoryProvider: Provider = { provide: ORDER_STATUS_HISTORY_REPOSITORY, useClass: PrismaOrderStatusHistoryRepository };
export const OrderNoteRepositoryProvider: Provider = { provide: ORDER_NOTE_REPOSITORY, useClass: PrismaOrderNoteRepository };
export const OrderCancellationRepositoryProvider: Provider = { provide: ORDER_CANCELLATION_REPOSITORY, useClass: PrismaOrderCancellationRepository };

export const ORDER_PROVIDERS: Provider[] = [
  OrderRepositoryProvider, OrderHistoryRepositoryProvider,
  OrderNoteRepositoryProvider, OrderCancellationRepositoryProvider,
  OrderAppService,
];
