import { Injectable } from '@nestjs/common';
import { IPermissionRegistry, RegisteredResource } from '../../application/interfaces';
import { ActionName } from '../../domain/types';

@Injectable()
export class PermissionRegistry implements IPermissionRegistry {
  private resources: Map<string, RegisteredResource> = new Map();
  private actions: Set<ActionName> = new Set<ActionName>([
    'create', 'read', 'update', 'delete', 'list',
    'export', 'import', 'approve', 'cancel',
    'archive', 'restore', 'manage',
  ]);

  registerResource(resource: string, actions: ActionName[], description?: string): void {
    this.resources.set(resource, { name: resource, actions, description });
    for (const action of actions) {
      this.actions.add(action);
    }
  }

  registerAction(action: ActionName, _description?: string): void {
    this.actions.add(action);
  }

  getRegisteredResources(): RegisteredResource[] {
    return Array.from(this.resources.values());
  }

  getRegisteredActions(): ActionName[] {
    return Array.from(this.actions);
  }

  isValidResource(resource: string): boolean {
    return this.resources.has(resource);
  }

  isValidAction(action: string): boolean {
    return this.actions.has(action as ActionName);
  }
}
