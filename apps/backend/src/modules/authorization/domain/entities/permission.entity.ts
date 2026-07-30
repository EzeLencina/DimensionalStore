import { PermissionId } from '../value-objects/permission-id.value-object';
import { ActionName, Scope } from '../types';

export class Permission {
  private readonly id: PermissionId;
  private resource: string;
  private action: ActionName;
  private scope: Scope;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id?: PermissionId;
    resource: string;
    action: ActionName;
    scope?: Scope;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? new PermissionId();
    this.resource = params.resource;
    this.action = params.action;
    this.scope = params.scope ?? { type: 'global' };
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  getId(): PermissionId { return this.id; }
  getResource(): string { return this.resource; }
  getAction(): ActionName { return this.action; }
  getScope(): Scope { return { ...this.scope }; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  updateResource(resource: string): void { this.resource = resource; this.touch(); }
  updateAction(action: ActionName): void { this.action = action; this.touch(); }
  updateScope(scope: Scope): void { this.scope = { ...scope }; this.touch(); }

  matches(resource: string, action: ActionName): boolean {
    return this.resource === resource && this.action === action;
  }

  private touch(): void { this.updatedAt = new Date(); }
}
