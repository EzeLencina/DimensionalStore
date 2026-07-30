import { Injectable, Logger } from '@nestjs/common';
import type { TemplateVariables, TemplateResult } from '../types';
import { TemplateEngine } from '../templates';
import { TemplateCompiler } from '../templates/template-compiler';
import { MailRendererException } from '../exceptions';

export interface RenderOptions {
  layout?: string;
  inlineCss?: boolean;
  minify?: boolean;
}

@Injectable()
export class TemplateRenderer {
  private readonly logger = new Logger(TemplateRenderer.name);

  constructor(
    private readonly compiler: TemplateCompiler,
  ) {}

  render(templateName: string, variables: TemplateVariables): TemplateResult {
    try {
      return this.compiler.compile(templateName, variables);
    } catch (error) {
      throw new MailRendererException(
        `Render failed: ${(error as Error).message}`,
        {
          templateName,
          error: (error as Error).message,
        },
      );
    }
  }

  renderToString(templateName: string, variables: TemplateVariables): string {
    return this.render(templateName, variables).html;
  }

  renderSubject(templateName: string, variables: TemplateVariables): string {
    return this.render(templateName, variables).subject;
  }
}
