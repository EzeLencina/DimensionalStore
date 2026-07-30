import { MFA_CONSTANTS } from '../../constants';

export class MfaValidators {
  static isValidTotpCode(code: string): boolean {
    return /^\d{6}$/.test(code);
  }

  static isValidBackupCode(code: string): boolean {
    if (code.length !== MFA_CONSTANTS.BACKUP_CODE_LENGTH) return false;
    const validChars = MFA_CONSTANTS.BACKUP_CODE_CHARSET;
    for (const char of code) {
      if (!validChars.includes(char)) return false;
    }
    return true;
  }

  static isValidDeviceId(deviceId: string): boolean {
    return deviceId.length > 0 && deviceId.length <= 256;
  }

  static isValidChallengeId(challengeId: string): boolean {
    return challengeId.length > 0 && challengeId.length <= 64;
  }

  static isValidRecoveryToken(token: string): boolean {
    return token.length > 0 && token.length <= 128;
  }

  static isValidMfaMethod(method: string): method is 'totp' | 'backup_codes' | 'trusted_device' {
    return ['totp', 'backup_codes', 'trusted_device'].includes(method);
  }

  static isValidSecret(secret: string): boolean {
    return secret.length >= 16 && /^[A-Z2-7]+=*$/.test(secret);
  }

  static formatBackupCode(code: string): string {
    const parts: string[] = [];
    for (let i = 0; i < code.length; i += 5) {
      parts.push(code.substring(i, i + 5));
    }
    return parts.join('-');
  }
}
