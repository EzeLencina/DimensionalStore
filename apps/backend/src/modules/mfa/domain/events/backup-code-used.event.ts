import { DomainEvent } from './domain-event';

export class BackupCodeUsedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly codeId: string,
  ) {
    super('mfa.backup_code.used');
  }
}
