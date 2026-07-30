import { FactoryProvider } from '@nestjs/common';
import { MAIL_TOKENS } from '../constants/mail-tokens';
import { MailManagerService } from '../services/mail-manager.service';

export const mailProviderProvider: FactoryProvider = {
  provide: MAIL_TOKENS.PROVIDER,
  useFactory: (manager: MailManagerService) => manager.getProvider(),
  inject: [MailManagerService],
};
