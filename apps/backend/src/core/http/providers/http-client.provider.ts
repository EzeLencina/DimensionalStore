import { FactoryProvider } from '@nestjs/common';
import { IHttpClient } from '../interfaces';
import { HttpManagerService } from '../services/http-manager.service';
import { HTTP_TOKENS } from '../constants/http-tokens';

export const httpClientProvider: FactoryProvider = {
  provide: HTTP_TOKENS.CLIENT,
  useFactory: (manager: HttpManagerService): IHttpClient => {
    return manager.getClient();
  },
  inject: [HttpManagerService],
};
