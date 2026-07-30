import { MfaValidators } from '../application/validators';

export { MfaValidators as MfaValidatorsExport } from '../application/validators';

export function validateTotpCode(code: string): boolean {
  return MfaValidators.isValidTotpCode(code);
}

export function validateBackupCode(code: string): boolean {
  return MfaValidators.isValidBackupCode(code);
}

export function validateDeviceId(deviceId: string): boolean {
  return MfaValidators.isValidDeviceId(deviceId);
}

export function validateChallengeId(challengeId: string): boolean {
  return MfaValidators.isValidChallengeId(challengeId);
}

export function validateRecoveryToken(token: string): boolean {
  return MfaValidators.isValidRecoveryToken(token);
}

export function validateMfaMethod(method: string): boolean {
  return MfaValidators.isValidMfaMethod(method);
}

export function formatBackupCode(code: string): string {
  return MfaValidators.formatBackupCode(code);
}
