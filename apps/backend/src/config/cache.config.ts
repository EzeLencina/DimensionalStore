import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  ttl: parseInt(process.env['CACHE_TTL'] ?? '300', 10),
}));
