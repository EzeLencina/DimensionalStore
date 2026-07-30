import { DomainEvent } from './domain-event';
import { TenantContext } from '../types';

export class ContextResolvedEvent extends DomainEvent {
  constructor(
    public readonly context: TenantContext,
  ) { super('tenant.context.resolved'); }
}
