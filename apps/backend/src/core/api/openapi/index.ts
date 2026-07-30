import { Injectable, Logger } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';

@Injectable()
export class OpenApiService {
  private readonly logger = new Logger(OpenApiService.name);
  private document: OpenAPIObject | null = null;

  setDocument(document: OpenAPIObject): void {
    this.document = document;
    this.logger.log({
      message: 'OpenAPI document registered',
      context: 'OpenApiService',
      data: {
        paths: Object.keys(document.paths).length,
        schemas: Object.keys(document.components?.schemas ?? {}).length,
      },
    });
  }

  getDocument(): OpenAPIObject | null {
    return this.document;
  }

  getPaths(): string[] {
    if (!this.document) return [];
    return Object.keys(this.document.paths);
  }

  getSchemas(): string[] {
    if (!this.document?.components?.schemas) return [];
    return Object.keys(this.document.components.schemas);
  }
}
