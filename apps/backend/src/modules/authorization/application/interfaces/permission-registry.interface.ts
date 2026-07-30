import { ActionName } from '../../domain/types';

export interface RegisteredResource {
  name: string;
  description?: string;
  actions: ActionName[];
}

export interface IPermissionRegistry {
  registerResource(resource: string, actions: ActionName[], description?: string): void;
  registerAction(action: ActionName, description?: string): void;
  getRegisteredResources(): RegisteredResource[];
  getRegisteredActions(): ActionName[];
  isValidResource(resource: string): boolean;
  isValidAction(action: string): boolean;
}
