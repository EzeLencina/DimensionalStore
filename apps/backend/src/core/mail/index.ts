export { MailModule } from './mail.module';
export { MailConfigurationFactory } from './config';
export { MailDriverFactory } from './factory';
export {
  SmtpDriver,
  LogDriver,
  SesDriver,
  SendgridDriver,
  MailgunDriver,
  ResendDriver,
} from './drivers';
export { MailManagerService, MailService } from './services';
export { TemplateEngine, TemplateCompiler } from './templates';
export { TemplateRenderer } from './renderer';
export { MailHealthService } from './health';
export { MailQueueIntegration } from './queue';
export { MailValidator, MailSanitizer } from './utils';
export { MAIL_TOKENS, MAIL_DEFAULTS, MAIL_ERROR_CODES } from './constants';
export {
  MailSendException,
  MailConnectionException,
  MailAuthenticationException,
  MailProviderUnavailableException,
  MailTimeoutException,
  MailInvalidAddressException,
  MailTemplateException,
  MailRendererException,
  MailConfigurationException,
  MailRateLimitException,
} from './exceptions';
export type { IMailProvider, IMailManager } from './interfaces';
export type {
  MailProviderType,
  MailAddress,
  MailConfiguration,
  SendMailOptions,
  Attachment,
  SendMailResult,
  BulkMailResult,
  ConnectionHealth,
  MailPriority,
  TemplateConfig,
  TemplateVariables,
  TemplateResult,
  LayoutDefinition,
  PartialDefinition,
  EmailTemplate,
  TemplateEngineType,
} from './types';
export type { QueuedMailOptions } from './queue';
export type { RenderOptions } from './renderer';
