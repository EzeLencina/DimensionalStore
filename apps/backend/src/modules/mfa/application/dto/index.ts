export interface MfaEnrollRequestDto {
  method: 'totp';
  issuer?: string;
}

export interface MfaEnrollResponseDto {
  userId: string;
  method: string;
  secret?: string;
  qrPayload?: string;
  backupCodes?: string[];
  enrolledAt: string;
}

export interface MfaVerifyRequestDto {
  challengeId: string;
  code: string;
}

export interface MfaVerifyResponseDto {
  verified: boolean;
  userId: string;
  method: string;
}

export interface MfaChallengeResponseDto {
  challengeId: string;
  method: string;
  expiresAt: string;
}

export interface MfaStateResponseDto {
  userId: string;
  enabled: boolean;
  enrolledMethods: string[];
  enrolledAt?: string;
}

export interface MfaTrustDeviceRequestDto {
  deviceId: string;
}

export interface MfaTrustDeviceResponseDto {
  deviceId: string;
  trustedAt: string;
  expiresAt: string;
}

export interface MfaRecoveryStartResponseDto {
  token: string;
  expiresAt: string;
}

export interface MfaRecoveryCompleteRequestDto {
  token: string;
}

export interface MfaBackupCodesResponseDto {
  codes: string[];
  generatedAt: string;
}

export interface MfaMethodDto {
  method: string;
  status: string;
  enabledAt: string;
}
