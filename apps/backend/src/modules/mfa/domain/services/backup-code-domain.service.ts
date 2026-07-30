import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import type { BackupCode, BackupCodeResult } from '../types';
import { MfaException, MFA_ERROR_CODES } from '../exceptions';
import { MFA_CONSTANTS } from '../../constants';

export interface IBackupCodeHashing {
  hash(code: string): Promise<string>;
  verify(hash: string, code: string): Promise<boolean>;
}

export class BackupCodeDomainService {
  constructor(private readonly hashing: IBackupCodeHashing) {}

  async generateCodes(count: number = MFA_CONSTANTS.BACKUP_CODE_COUNT): Promise<BackupCodeResult> {
    const plainCodes: string[] = [];
    const hashedCodes: BackupCode[] = [];

    for (let i = 0; i < count; i++) {
      const code = this.generateSingleCode();
      plainCodes.push(code);

      const hashed = await this.hashing.hash(code);
      hashedCodes.push({
        id: `bc_${hashed.substring(0, 16)}`,
        userId: '',
        hashedCode: hashed,
        used: false,
        createdAt: new Date(),
      });
    }

    return { plainCodes, hashedCodes };
  }

  async verifyCode(storedHash: string, providedCode: string): Promise<boolean> {
    this.validateFormat(providedCode);
    return this.hashing.verify(storedHash, providedCode);
  }

  validateFormat(code: string): void {
    if (!code || code.length !== MFA_CONSTANTS.BACKUP_CODE_LENGTH) {
      throw new MfaException(
        MFA_ERROR_CODES.MFA_INVALID_BACKUP_CODE,
        `Backup code must be exactly ${MFA_CONSTANTS.BACKUP_CODE_LENGTH} characters`,
      );
    }

    const validChars = MFA_CONSTANTS.BACKUP_CODE_CHARSET;
    for (const char of code) {
      if (!validChars.includes(char)) {
        throw new MfaException(MFA_ERROR_CODES.MFA_INVALID_BACKUP_CODE, 'Backup code contains invalid characters');
      }
    }
  }

  formatCode(code: string): string {
    const parts: string[] = [];
    for (let i = 0; i < code.length; i += 5) {
      parts.push(code.substring(i, i + 5));
    }
    return parts.join('-');
  }

  private generateSingleCode(): string {
    const chars = MFA_CONSTANTS.BACKUP_CODE_CHARSET;
    const bytes = randomBytes(MFA_CONSTANTS.BACKUP_CODE_LENGTH);
    let code = '';
    for (let i = 0; i < MFA_CONSTANTS.BACKUP_CODE_LENGTH; i++) {
      code += chars[bytes[i]! % chars.length];
    }
    return code;
  }
}
