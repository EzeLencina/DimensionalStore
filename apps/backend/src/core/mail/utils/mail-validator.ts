export class MailValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MAX_RECIPIENTS = 50;
  private static readonly SUBJECT_MAX_LENGTH = 255;

  isValidEmail(email: string): boolean {
    return MailValidator.EMAIL_REGEX.test(email);
  }

  validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];

    for (const email of emails) {
      if (this.isValidEmail(email)) {
        valid.push(email);
      } else {
        invalid.push(email);
      }
    }

    return { valid, invalid };
  }

  validateSubject(subject: string): { valid: boolean; error?: string } {
    if (!subject || subject.trim().length === 0) {
      return { valid: false, error: 'Subject is required' };
    }
    if (subject.length > MailValidator.SUBJECT_MAX_LENGTH) {
      return { valid: false, error: `Subject exceeds ${MailValidator.SUBJECT_MAX_LENGTH} characters` };
    }
    return { valid: true };
  }

  validateRecipientsCount(count: number): { valid: boolean; error?: string } {
    if (count > MailValidator.MAX_RECIPIENTS) {
      return { valid: false, error: `Too many recipients (max: ${MailValidator.MAX_RECIPIENTS})` };
    }
    return { valid: true };
  }
}
