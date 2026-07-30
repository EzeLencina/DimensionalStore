import { Injectable, Logger } from '@nestjs/common';
import type { TemplateVariables, TemplateResult } from '../types';
import { MailTemplateException, MailRendererException } from '../exceptions';
import { TemplateEngine } from './index';

@Injectable()
export class TemplateCompiler {
  private readonly logger = new Logger(TemplateCompiler.name);

  constructor(
    private readonly engine: TemplateEngine,
  ) {}

  compile(templateName: string, variables: TemplateVariables): TemplateResult {
    const template = this.engine.getTemplate(templateName);

    if (!template) {
      throw new MailTemplateException(
        `Template not found: ${templateName}`,
        { templateName },
      );
    }

    try {
      const html = this.renderString(template.html, variables);
      const text = template.text ? this.renderString(template.text, variables) : undefined;
      const subject = this.renderString(template.subject, variables);

      return { html, text, subject };
    } catch (error) {
      throw new MailRendererException(
        `Failed to render template: ${(error as Error).message}`,
        {
          templateName,
          error: (error as Error).message,
        },
      );
    }
  }

  private renderString(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const value = variables[key];
      if (value === undefined || value === null) {
        this.logger.warn({
          message: `Missing template variable: ${key}`,
          context: 'TemplateCompiler',
        });
        return `{{${key}}}`;
      }
      return String(value);
    });
  }
}
