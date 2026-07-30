import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { SecurityBootstrap } from '@core/security/security-bootstrap.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  const securityBootstrap = app.get(SecurityBootstrap);
  securityBootstrap.apply(app);

  app.enableShutdownHooks();

  const port = process.env['PORT'] ?? 4000;
  await app.listen(port);
}

bootstrap();
