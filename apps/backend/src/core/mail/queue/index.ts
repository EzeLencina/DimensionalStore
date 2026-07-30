import { Injectable, Logger } from '@nestjs/common';
import type { SendMailOptions, SendMailResult, BulkMailResult, MailAddress, Attachment, MailPriority } from '../types';
import { MailService } from '../services/mail.service';
import { MailConfigurationFactory } from '../config';

export interface QueuedMailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: MailAddress;
  replyTo?: string;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  priority?: MailPriority;
  metadata?: Record<string, string>;
  delay?: number;
  queuePriority?: number;
  jobId?: string;
}

@Injectable()
export class MailQueueIntegration {
  private readonly logger = new Logger(MailQueueIntegration.name);

  constructor(
    private readonly mailService: MailService,
    private readonly configFactory: MailConfigurationFactory,
  ) {}

  async enqueue(message: QueuedMailOptions): Promise<void> {
    const config = this.configFactory.getConfiguration();

    this.logger.log({
      message: `Email queued for sending`,
      context: 'MailQueueIntegration',
      data: {
        to: message.to,
        subject: message.subject,
        delay: message.delay,
        priority: message.priority,
        provider: config.driver,
      },
    });
  }

  async enqueueBulk(messages: QueuedMailOptions[]): Promise<void> {
    for (const msg of messages) {
      await this.enqueue(msg);
    }
  }

  async processQueuedMail(message: SendMailOptions): Promise<SendMailResult> {
    return this.mailService.send(message);
  }

  async processQueuedBulk(messages: SendMailOptions[]): Promise<BulkMailResult> {
    const start = Date.now();
    const results = await this.mailService.sendBulk(messages);
    const duration = Date.now() - start;

    return {
      total: results.length,
      succeeded: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
      duration,
    };
  }
}
