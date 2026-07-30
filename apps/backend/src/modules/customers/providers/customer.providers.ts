import { Provider } from '@nestjs/common';
import { PrismaClient } from '@tienda/database';
import { CUSTOMER_REPOSITORY, CUSTOMER_ADDRESS_REPOSITORY, CUSTOMER_TAG_REPOSITORY, CUSTOMER_NOTE_REPOSITORY } from '../domain';
import { PrismaCustomerRepository, PrismaCustomerAddressRepository, PrismaCustomerTagRepository, PrismaCustomerNoteRepository } from '../infrastructure';
import { CustomerAppService } from '../services';

export const CustomerRepositoryProvider: Provider = { provide: CUSTOMER_REPOSITORY, useClass: PrismaCustomerRepository };
export const CustomerAddressRepositoryProvider: Provider = { provide: CUSTOMER_ADDRESS_REPOSITORY, useClass: PrismaCustomerAddressRepository };
export const CustomerTagRepositoryProvider: Provider = { provide: CUSTOMER_TAG_REPOSITORY, useClass: PrismaCustomerTagRepository };
export const CustomerNoteRepositoryProvider: Provider = { provide: CUSTOMER_NOTE_REPOSITORY, useClass: PrismaCustomerNoteRepository };

export const CUSTOMER_PROVIDERS: Provider[] = [
  CustomerRepositoryProvider, CustomerAddressRepositoryProvider, CustomerTagRepositoryProvider, CustomerNoteRepositoryProvider,
  CustomerAppService,
];
