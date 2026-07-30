import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerConfig, swaggerCustomOptions } from './swagger.config';
import { ApiConfigurationFactory } from '../config';

export function setupSwagger(
  app: INestApplication,
  configFactory?: ApiConfigurationFactory,
): void {
  const logger = new Logger('SwaggerSetup');
  const version = configFactory
    ? configFactory.getVersioningConfig().defaultVersion
    : '1.0';

  const config = createSwaggerConfig(version).build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}_${methodKey}`,
  });

  SwaggerModule.setup('api/docs', app, document, swaggerCustomOptions);

  logger.log({
    message: 'Swagger documentation initialized',
    context: 'SwaggerSetup',
    data: { version, url: '/api/docs' },
  });
}
