import type { PayloadLimitConfig } from '../types';
import { DEFAULT_PAYLOAD_LIMITS } from '../constants';
import { BadRequestException } from '@nestjs/common';

export class PayloadLimitsConfigurator {
  private readonly config: PayloadLimitConfig;

  constructor(config?: Partial<PayloadLimitConfig>) {
    this.config = { ...DEFAULT_PAYLOAD_LIMITS, ...config };
  }

  apply(app: any): void {
    const bodyParser = app.getHttpAdapter()?.getInstance();

    if (bodyParser) {
      app.useBodyParser('json', { limit: this.config.multipart });
    }
  }

  getMulterOptions(): any {
    return {
      limits: {
        fileSize: this.config.upload,
        files: this.config.maxFileCount,
        fieldSize: this.config.maxFieldSize,
        fields: this.config.maxFields,
      },
      fileFilter: (_req: any, file: any, cb: any) => {
        if (this.config.allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `File type ${file.mimetype} is not allowed. Allowed: ${this.config.allowedMimeTypes.join(', ')}`,
            ),
            false,
          );
        }
      },
    };
  }

  getConfig(): PayloadLimitConfig {
    return { ...this.config };
  }
}
