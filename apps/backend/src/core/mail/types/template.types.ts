export interface TemplateConfig {
  readonly name: string;
  readonly subject: string;
  readonly layout?: string;
  readonly partials?: string[];
}

export interface TemplateVariables {
  [key: string]: string | number | boolean | Record<string, unknown> | unknown[] | undefined | null;
}

export interface TemplateResult {
  html: string;
  text?: string;
  subject: string;
}

export interface LayoutDefinition {
  name: string;
  content: string;
}

export interface PartialDefinition {
  name: string;
  content: string;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text?: string;
  layout?: string;
}

export type TemplateEngineType = 'handlebars' | 'simple';
