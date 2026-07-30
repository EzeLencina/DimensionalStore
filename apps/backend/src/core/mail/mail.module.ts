import { Global, Module } from '@nestjs/common';
import { MailConfigurationFactory } from './config';
import { MailDriverFactory } from './factory';
import {
  SmtpDriver,
  LogDriver,
  SesDriver,
  SendgridDriver,
  MailgunDriver,
  ResendDriver,
} from './drivers';
import { MailManagerService, MailService } from './services';
import { TemplateEngine, TemplateCompiler } from './templates';
import { TemplateRenderer } from './renderer';
import { MailHealthService } from './health';
import { MailQueueIntegration } from './queue';
import { mailProviderProvider } from './providers';

@Global()
@Module({
  providers: [
    MailConfigurationFactory,
    MailDriverFactory,
    SmtpDriver,
    LogDriver,
    SesDriver,
    SendgridDriver,
    MailgunDriver,
    ResendDriver,
    MailManagerService,
    MailService,
    TemplateEngine,
    TemplateCompiler,
    TemplateRenderer,
    MailHealthService,
    MailQueueIntegration,
    mailProviderProvider,
  ],
  exports: [
    MailConfigurationFactory,
    MailDriverFactory,
    SmtpDriver,
    LogDriver,
    MailManagerService,
    MailService,
    TemplateEngine,
    TemplateCompiler,
    TemplateRenderer,
    MailHealthService,
    MailQueueIntegration,
  ],
})
export class MailModule {}
