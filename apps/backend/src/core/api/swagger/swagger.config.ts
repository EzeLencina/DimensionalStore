import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export function createSwaggerConfig(version: string): DocumentBuilder {
  return new DocumentBuilder()
    .setTitle('Tienda API')
    .setDescription(
      'Enterprise platform API for Ecommerce, ERP, CRM, Dashboard, and Public API.',
    )
    .setVersion(version)
    .setContact('Tienda Engineering', '', 'engineering@tienda.local')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(`http://localhost:${process.env['PORT'] ?? '4000'}`, 'Local Development')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'JWT access token' },
      'JWT',
    )
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header', description: 'API key for external integrations' },
      'API_KEY',
    )
    .addGlobalParameters();
}

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    syntaxHighlight: { theme: 'monokai' },
  },
  customSiteTitle: 'Tienda API Docs',
  customfavIcon: '/favicon.ico',
  customCss: '.swagger-ui .topbar { display: none }',
};
