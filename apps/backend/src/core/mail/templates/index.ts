import { Injectable, Logger } from '@nestjs/common';
import type {
  TemplateConfig,
  TemplateVariables,
  TemplateResult,
  LayoutDefinition,
  PartialDefinition,
  EmailTemplate,
} from '../types';
import { MailTemplateException } from '../exceptions';

@Injectable()
export class TemplateEngine {
  private readonly logger = new Logger(TemplateEngine.name);
  private readonly templates: Map<string, EmailTemplate> = new Map();
  private readonly layouts: Map<string, LayoutDefinition> = new Map();
  private readonly partials: Map<string, PartialDefinition> = new Map();

  registerTemplate(template: EmailTemplate): void {
    this.templates.set(template.name, template);
    this.logger.debug({
      message: `Template registered: ${template.name}`,
      context: 'TemplateEngine',
    });
  }

  registerLayout(layout: LayoutDefinition): void {
    this.layouts.set(layout.name, layout);
  }

  registerPartial(partial: PartialDefinition): void {
    this.partials.set(partial.name, partial);
  }

  getTemplate(name: string): EmailTemplate | undefined {
    return this.templates.get(name);
  }

  hasTemplate(name: string): boolean {
    return this.templates.has(name);
  }

  removeTemplate(name: string): void {
    this.templates.delete(name);
  }

  clearTemplates(): void {
    this.templates.clear();
  }

  getTemplateNames(): string[] {
    return Array.from(this.templates.keys());
  }

  getTemplateCount(): number {
    return this.templates.size;
  }
}

export { TemplateCompiler } from './template-compiler';
