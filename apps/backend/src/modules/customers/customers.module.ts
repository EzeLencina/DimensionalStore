import { Module } from '@nestjs/common';
import { LoggerModule } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { AdminCustomerController, AdminCustomerTagController, CustomerAccountController } from './presentation';
import { CUSTOMER_PROVIDERS } from './providers';
import { CustomerEventHandler } from './events';
import { APP_FILTER } from '@nestjs/core';
import { CustomerExceptionFilter } from './presentation';
import { CustomerAppService } from './services';

@Module({
  imports: [LoggerModule],
  controllers: [AdminCustomerController, AdminCustomerTagController, CustomerAccountController],
  providers: [
    ...CUSTOMER_PROVIDERS,
    CustomerEventHandler,
    { provide: APP_FILTER, useClass: CustomerExceptionFilter },
    { provide: 'PRISMA_CLIENT_CUSTOMERS', useFactory: () => new PrismaClient() },
    { provide: 'USER_READER', useFactory: () => ({ exists: async () => true }) },
    { provide: 'ORDER_READER', useFactory: () => ({ countByCustomer: async () => 0, sumSpentByCustomer: async () => 0, findOrderTimestampsByCustomer: async () => ({ firstOrderAt: null, lastOrderAt: null }) }) },
    { provide: 'EVENT_PUBLISHER_CUSTOMERS', useFactory: () => ({ publish: async () => {} }) },
    { provide: 'CLOCK_CUSTOMERS', useFactory: () => ({ now: () => new Date() }) },
    { provide: 'CURRENT_ACTOR_CUSTOMERS', useFactory: () => ({ getType: () => 'SYSTEM', getId: () => null }) },
  ],
  exports: [CustomerAppService],
})
export class CustomersModule {}
