import { MfaMethod, MfaState, MfaEnrollmentResult, MfaVerificationResult, TrustedDevice, MfaChallenge } from '../../domain/types';

export interface IMfaService {
  getState(userId: string): Promise<MfaState>;
  enrollTotp(userId: string, issuer?: string): Promise<MfaEnrollmentResult>;
  generateBackupCodes(userId: string): Promise<{ plainCodes: string[] }>;
  verifyTotp(userId: string, code: string): Promise<boolean>;
  verifyBackupCode(userId: string, code: string): Promise<boolean>;
  generateChallenge(userId: string, method: MfaMethod): Promise<MfaChallenge>;
  verifyChallenge(challengeId: string, code: string): Promise<MfaVerificationResult>;
  isTrustedDevice(userId: string, deviceId: string): Promise<boolean>;
  trustDevice(userId: string, deviceId: string): Promise<TrustedDevice>;
  removeTrustedDevice(userId: string, deviceId: string): Promise<void>;
  disableMfa(userId: string): Promise<void>;
  disableMethod(userId: string, method: MfaMethod): Promise<void>;
  startRecovery(userId: string): Promise<{ token: string }>;
  completeRecovery(userId: string, token: string): Promise<void>;
  resetMfa(userId: string): Promise<void>;
}
