import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  url: process.env['REDIS_QUEUE_URL'] ?? 'redis://localhost:6379/1',
}));
