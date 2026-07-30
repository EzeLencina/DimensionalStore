import { MfaMethod, MfaChallenge, MfaEnrollment, BackupCode, TrustedDevice, RecoveryToken } from '../types';

export interface IChallengeStore {
  save(challenge: MfaChallenge): Promise<void>;
  findById(challengeId: string): Promise<MfaChallenge | null>;
  findByUserId(userId: string): Promise<MfaChallenge[]>;
  update(challenge: MfaChallenge): Promise<void>;
  delete(challengeId: string): Promise<void>;
}

export interface IEnrollmentStore {
  save(enrollment: MfaEnrollment): Promise<void>;
  findByUserId(userId: string): Promise<MfaEnrollment[]>;
  findByUserIdAndMethod(userId: string, method: MfaMethod): Promise<MfaEnrollment | null>;
  update(enrollment: MfaEnrollment): Promise<void>;
  deleteByUserIdAndMethod(userId: string, method: MfaMethod): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}

export interface IBackupCodeStore {
  save(code: BackupCode): Promise<void>;
  saveMany(codes: BackupCode[]): Promise<void>;
  findByUserId(userId: string): Promise<BackupCode[]>;
  findUnusedByUserId(userId: string): Promise<BackupCode[]>;
  update(code: BackupCode): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface ITrustedDeviceStore {
  save(device: TrustedDevice): Promise<void>;
  findById(id: string): Promise<TrustedDevice | null>;
  findByUserId(userId: string): Promise<TrustedDevice[]>;
  findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<TrustedDevice | null>;
  update(device: TrustedDevice): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface IRecoveryTokenStore {
  save(token: RecoveryToken): Promise<void>;
  findById(id: string): Promise<RecoveryToken | null>;
  findByUserId(userId: string): Promise<RecoveryToken[]>;
  findByUserIdActive(userId: string): Promise<RecoveryToken | null>;
  update(token: RecoveryToken): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface ITotpProvider {
  generateSecret(): { secret: string; base32: string };
  generateCode(secret: string, time?: number): string;
  verifyCode(secret: string, token: string, window?: number): boolean;
  getQrPayload(secret: string, issuer: string, account: string): string;
}

export interface IHashingProvider {
  hash(data: string): Promise<string>;
  verify(hash: string, data: string): Promise<boolean>;
}
