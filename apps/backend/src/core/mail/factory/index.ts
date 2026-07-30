import { Injectable, Logger } from '@nestjs/common';
import type { IMailProvider } from '../interfaces';
import type { MailProviderType } from '../types';
import { MailConfigurationFactory } from '../config';
import { SmtpDriver, LogDriver, SesDriver, SendgridDriver, MailgunDriver, ResendDriver } from '../drivers';
import { MailConfigurationException } from '../exceptions';

@Injectable()
export class MailDriverFactory {
  private readonly logger = new Logger(MailDriverFactory.name);

  constructor(
    private readonly configFactory: MailConfigurationFactory,
    private readonly smtpDriver: SmtpDriver,
    private readonly logDriver: LogDriver,
    private readonly sesDriver: SesDriver,
    private readonly sendgridDriver: SendgridDriver,
    private readonly mailgunDriver: MailgunDriver,
    private readonly resendDriver: ResendDriver,
  ) {}

  createDriver(type?: MailProviderType): IMailProvider {
    const driverType = type ?? this.configFactory.getProviderType();

    this.logger.log({
      message: `Creating mail driver: ${driverType}`,
      context: 'MailDriverFactory',
      data: { driver: driverType },
    });

    switch (driverType) {
      case 'smtp':
        return this.smtpDriver;
      case 'log':
        return this.logDriver;
      case 'ses':
        return this.sesDriver;
      case 'sendgrid':
        return this.sendgridDriver;
      case 'mailgun':
        return this.mailgunDriver;
      case 'resend':
        return this.resendDriver;
      default:
        throw new MailConfigurationException(
          `Unsupported mail driver type: ${driverType as string}`,
          { driver: driverType },
        );
    }
  }
}
