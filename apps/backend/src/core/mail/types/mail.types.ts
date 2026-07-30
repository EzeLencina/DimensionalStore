export type MailProviderType = 'smtp' | 'ses' | 'sendgrid' | 'mailgun' | 'resend' | 'log';

export interface MailAddress {
  name?: string;
  address: string;
}

export interface MailConfiguration {
  readonly driver: MailProviderType;
  readonly host: string;
  readonly port: number;
  readonly user?: string;
  readonly pass?: string;
  readonly fromAddress: string;
  readonly fromName: string;
  readonly replyTo?: string;
  readonly tls: boolean;
  readonly timeout: number;
  readonly maxConnections: number;
  readonly pool: boolean;
  readonly retryAttempts: number;
  readonly retryDelay: number;
  readonly rateLimit: number;
  readonly rateLimitInterval: number;
  readonly apiKey?: string;
  readonly region?: string;
}

export interface SendMailOptions {
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
  priority?: 'high' | 'normal' | 'low';
  metadata?: Record<string, string>;
}

export interface Attachment {
  filename: string;
  content?: Buffer | string;
  path?: string;
  contentType?: string;
  cid?: string;
  encoding?: string;
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  provider: string;
  timestamp: Date;
  duration: number;
  error?: string;
  to: string[];
  subject: string;
  attempts?: number;
}

export interface BulkMailResult {
  total: number;
  succeeded: number;
  failed: number;
  results: SendMailResult[];
  duration: number;
}

export interface ConnectionHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  provider: string;
  error?: string;
}

export type MailPriority = 'high' | 'normal' | 'low';
