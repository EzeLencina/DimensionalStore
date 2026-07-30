import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  endpoint: process.env['R2_ENDPOINT'] ?? '',
  accessKey: process.env['R2_ACCESS_KEY'] ?? '',
  secretKey: process.env['R2_SECRET_KEY'] ?? '',
  bucket: process.env['R2_BUCKET'] ?? 'tienda-assets',
}));
