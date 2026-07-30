import { PRODUCTS_CONSTANTS } from '../../constants';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_STATUSES = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];
const VALID_VISIBILITIES = ['PUBLIC', 'PRIVATE', 'HIDDEN'];
const VALID_CONDITIONS = ['NEW', 'REFURBISHED', 'USED'];
const VALID_TYPES = ['PHYSICAL', 'DIGITAL', 'SERVICE', 'BUNDLE'];

export class ProductValidators {
  static isValidName(name: unknown): name is string {
    if (typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length >= PRODUCTS_CONSTANTS.NAME_MIN_LENGTH
      && trimmed.length <= PRODUCTS_CONSTANTS.NAME_MAX_LENGTH;
  }

  static isValidSlug(slug: unknown): slug is string {
    if (typeof slug !== 'string') return false;
    return slug.length <= PRODUCTS_CONSTANTS.SLUG_MAX_LENGTH && SLUG_REGEX.test(slug);
  }

  static isValidStatus(status: unknown): status is string {
    return typeof status === 'string' && VALID_STATUSES.includes(status);
  }

  static isValidVisibility(visibility: unknown): visibility is string {
    return typeof visibility === 'string' && VALID_VISIBILITIES.includes(visibility);
  }

  static isValidCondition(condition: unknown): condition is string {
    return typeof condition === 'string' && VALID_CONDITIONS.includes(condition);
  }

  static isValidProductType(type: unknown): type is string {
    return typeof type === 'string' && VALID_TYPES.includes(type);
  }

  static isValidWarranty(months: unknown): months is number {
    if (months === null || months === undefined) return true;
    return typeof months === 'number' && Number.isInteger(months)
      && months >= PRODUCTS_CONSTANTS.WARRANTY_MIN_MONTHS
      && months <= PRODUCTS_CONSTANTS.WARRANTY_MAX_MONTHS;
  }

  static isValidSeoTitle(title: unknown): title is string | null {
    if (title === null || title === undefined) return true;
    return typeof title === 'string' && title.trim().length <= PRODUCTS_CONSTANTS.SEO_TITLE_MAX_LENGTH;
  }

  static isValidSeoDescription(description: unknown): description is string | null {
    if (description === null || description === undefined) return true;
    return typeof description === 'string' && description.trim().length <= PRODUCTS_CONSTANTS.SEO_DESCRIPTION_MAX_LENGTH;
  }

  static validateCreateInput(input: Record<string, unknown>): string[] {
    const errors: string[] = [];
    if (!ProductValidators.isValidName(input['name'])) errors.push('Invalid or missing name');
    if (!ProductValidators.isValidSlug(input['slug'])) errors.push('Invalid slug format');
    if (input['productType'] !== undefined && !ProductValidators.isValidProductType(input['productType'])) errors.push('Invalid product type');
    if (input['visibility'] !== undefined && !ProductValidators.isValidVisibility(input['visibility'])) errors.push('Invalid visibility');
    if (input['condition'] !== undefined && !ProductValidators.isValidCondition(input['condition'])) errors.push('Invalid condition');
    if (input['warrantyMonths'] !== undefined && !ProductValidators.isValidWarranty(input['warrantyMonths'])) errors.push('Invalid warranty months');
    if (input['seoTitle'] !== undefined && !ProductValidators.isValidSeoTitle(input['seoTitle'])) errors.push('Invalid SEO title');
    if (input['seoDescription'] !== undefined && !ProductValidators.isValidSeoDescription(input['seoDescription'])) errors.push('Invalid SEO description');
    return errors;
  }
}
