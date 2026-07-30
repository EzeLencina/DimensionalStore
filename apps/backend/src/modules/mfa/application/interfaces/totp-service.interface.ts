export interface ITotpService {
  generateSecret(): { secret: Buffer; base32: string };
  generateCode(secret: string, time?: number): string;
  verifyCode(secret: string, token: string, window?: number): boolean;
  getQrPayload(secret: string, issuer: string, account: string): string;
}
