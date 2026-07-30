export class TrustedDeviceInfo {
  private readonly id: string;
  private readonly userId: string;
  private readonly deviceId: string;
  private readonly expiresAt: Date;

  constructor(id: string, userId: string, deviceId: string, expiresAt: Date) {
    if (!id || id.trim().length === 0) {
      throw new Error('Trusted device ID cannot be empty');
    }
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
    if (!deviceId || deviceId.trim().length === 0) {
      throw new Error('Device ID cannot be empty');
    }
    if (!(expiresAt instanceof Date) || isNaN(expiresAt.getTime())) {
      throw new Error('Trusted device expiration must be a valid date');
    }
    if (expiresAt <= new Date()) {
      throw new Error('Trusted device expiration must be in the future');
    }
    this.id = id;
    this.userId = userId;
    this.deviceId = deviceId;
    this.expiresAt = expiresAt;
    Object.freeze(this);
  }

  getId(): string { return this.id; }
  getUserId(): string { return this.userId; }
  getDeviceId(): string { return this.deviceId; }
  getExpiresAt(): Date { return this.expiresAt; }

  isExpired(): boolean {
    return this.expiresAt <= new Date();
  }

  belongsTo(userId: string): boolean {
    return this.userId === userId;
  }

  equals(other: TrustedDeviceInfo): boolean {
    return this.id === other.getId();
  }
}
