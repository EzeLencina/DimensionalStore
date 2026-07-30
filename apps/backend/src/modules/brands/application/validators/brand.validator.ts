import type { CreateBrandCommand } from '../commands';

export class BrandValidator {
  static validateCreate(command: CreateBrandCommand): string[] {
    const errors: string[] = [];
    if (!command.name || command.name.trim().length === 0) {
      errors.push('Name is required');
    }
    if (command.name && command.name.length > 150) {
      errors.push('Name cannot exceed 150 characters');
    }
    if (!command.slug || command.slug.trim().length === 0) {
      errors.push('Slug is required');
    }
    if (command.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(command.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    if (command.logoUrl && !/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(command.logoUrl)) {
      errors.push('Invalid logo URL format');
    }
    if (command.websiteUrl && !/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(command.websiteUrl)) {
      errors.push('Invalid website URL format');
    }
    return errors;
  }

  static validateUpdate(data: Record<string, unknown>): string[] {
    const errors: string[] = [];
    if (data['name'] !== undefined && (typeof data['name'] !== 'string' || (data['name'] as string).trim().length === 0)) {
      errors.push('Name cannot be empty');
    }
    if (data['slug'] !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data['slug'] as string)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    if (data['slug'] !== undefined && typeof data['slug'] === 'string' && (data['slug'] as string).length > 200) {
      errors.push('Slug cannot exceed 200 characters');
    }
    return errors;
  }
}
