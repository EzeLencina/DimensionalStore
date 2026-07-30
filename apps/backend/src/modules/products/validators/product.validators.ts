import { ProductValidators } from '../application/validators';

export function validateProductName(name: unknown): name is string {
  return ProductValidators.isValidName(name);
}

export function validateProductSlug(slug: unknown): slug is string {
  return ProductValidators.isValidSlug(slug);
}

export function validateProductStatus(status: unknown): status is string {
  return ProductValidators.isValidStatus(status);
}

export function validateProductVisibility(visibility: unknown): visibility is string {
  return ProductValidators.isValidVisibility(visibility);
}
