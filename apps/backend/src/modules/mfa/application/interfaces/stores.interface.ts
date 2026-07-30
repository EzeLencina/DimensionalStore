export interface IBackupCodeStore {
  save(userId: string, hashedCode: string): Promise<void>;
  saveMany(userId: string, hashedCodes: string[]): Promise<void>;
  findUnusedByUserId(userId: string): Promise<Array<{ id: string; hashedCode: string }>>;
  markUsed(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface ITrustedDeviceStore {
  save(device: { id: string; userId: string; deviceId: string; expiresAt: Date }): Promise<void>;
  findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<{ id: string; expiresAt: Date; status: string } | null>;
  updateStatus(id: string, status: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
