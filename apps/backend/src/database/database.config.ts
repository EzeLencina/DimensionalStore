import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/tienda',
  replicaUrl: process.env['DATABASE_URL_REPLICA'],
  shadowUrl: process.env['SHADOW_DATABASE_URL'],
  pool: {
    min: Number(process.env['DATABASE_POOL_MIN']) ?? 2,
    max: Number(process.env['DATABASE_POOL_MAX']) ?? 10,
  },
  ssl: process.env['DATABASE_SSL'] === 'true',
  timeout: Number(process.env['DATABASE_QUERY_TIMEOUT']) ?? 30_000,
  retries: Number(process.env['DATABASE_CONNECTION_RETRIES']) ?? 5,
  retryDelay: Number(process.env['DATABASE_RETRY_DELAY']) ?? 2000,
}));
