export class MailSanitizer {
  private static readonly SENSITIVE_HEADERS = [
    'authorization',
    'x-api-key',
    'api-key',
    'password',
    'secret',
    'token',
  ];

  sanitizeHeader(value: string): string {
    return value.replace(/./g, '*');
  }

  sanitizeMessage(obj: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (MailSanitizer.SENSITIVE_HEADERS.includes(key.toLowerCase())) {
        sanitized[key] = this.sanitizeHeader(String(value));
      } else if (typeof value === 'object' && value !== null && !Buffer.isBuffer(value)) {
        sanitized[key] = this.sanitizeMessage(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }
}
