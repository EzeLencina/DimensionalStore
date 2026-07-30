import type { FactoryProvider } from '@nestjs/common';
import { PrismaClient } from '@tienda/database';
import { DATABASE_CONNECTION } from './database.constants';

export const prismaProvider: FactoryProvider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const client = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
    return client;
  },
};
