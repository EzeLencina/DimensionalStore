import { TenantContext } from '../types';
import { TenantException, TENANT_ERROR_CODES } from '../exceptions';

export class TenantValidator {
  validateTenantActive(context: TenantContext): void {
    if (context.tenant.status === 'suspended') {
      throw new TenantException(TENANT_ERROR_CODES.TENANT_SUSPENDED, 'Tenant is suspended');
    }
    if (context.tenant.status === 'archived') {
      throw new TenantException(TENANT_ERROR_CODES.TENANT_INACTIVE, 'Tenant is inactive');
    }
  }

  validateBranchActive(context: TenantContext): void {
    if (!context.branch) return;
    if (context.branch.status === 'inactive' || context.branch.status === 'archived') {
      throw new TenantException(TENANT_ERROR_CODES.BRANCH_INACTIVE, 'Branch is inactive');
    }
  }

  validateTenantAccess(requestTenantId: string, userTenantIds: string[]): void {
    if (!userTenantIds.includes(requestTenantId)) {
      throw new TenantException(
        TENANT_ERROR_CODES.CROSS_TENANT_ACCESS_DENIED,
        'Cross-tenant access denied',
      );
    }
  }

  validateSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2 && slug.length <= 100;
  }

  validateTaxIdentifier(taxId: string): boolean {
    return taxId.length >= 3 && taxId.length <= 20;
  }

  validateBranchCode(code: string): boolean {
    return code.length >= 1 && code.length <= 20;
  }
}
