export class BackupCodeHash {
  private readonly hashedValue: string;
  private readonly used: boolean;

  constructor(hashedValue: string, used = false) {
    if (!hashedValue || hashedValue.trim().length === 0) {
      throw new Error('Backup code hash cannot be empty');
    }
    if (hashedValue.length !== 64) {
      throw new Error('Backup code hash must be 64 hex characters');
    }
    if (!/^[a-f0-9]{64}$/i.test(hashedValue)) {
      throw new Error('Backup code hash must be valid hex');
    }
    this.hashedValue = hashedValue;
    this.used = used;
    Object.freeze(this);
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  isUsed(): boolean {
    return this.used;
  }

  equals(other: BackupCodeHash): boolean {
    return this.hashedValue === other.getHashedValue();
  }

  toString(): string {
    return this.hashedValue;
  }
}
