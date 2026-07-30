import type { ApiTestResponse } from '../types';

export interface ContractSchema {
  name: string;
  version: string;
  request: {
    method: string;
    path: string;
    headers?: Record<string, string>;
    query?: Record<string, string>;
    body?: unknown;
  };
  response: {
    status: number;
    body: Record<string, unknown>;
  };
}

export class ContractValidator {
  private contracts: Map<string, ContractSchema> = new Map();

  registerContract(name: string, contract: ContractSchema): void {
    this.contracts.set(name, contract);
  }

  getContract(name: string): ContractSchema | undefined {
    return this.contracts.get(name);
  }

  validateResponse<T>(
    contractName: string,
    response: ApiTestResponse<T>,
  ): { valid: boolean; errors: string[] } {
    const contract = this.contracts.get(contractName);
    if (!contract) {
      return { valid: false, errors: [`Contract "${contractName}" not found`] };
    }

    const errors: string[] = [];

    if (response.success !== undefined && typeof response.success !== 'boolean') {
      errors.push('response.success must be a boolean');
    }

    if (response.statusCode !== contract.response.status) {
      errors.push(
        `Expected status ${contract.response.status}, got ${response.statusCode}`,
      );
    }

    if (contract.response.body && response.data) {
      const schemaProps = Object.keys(contract.response.body);
      for (const prop of schemaProps) {
        if (!(prop in (response.data as Record<string, unknown>))) {
          errors.push(`Missing field "${prop}" in response data`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  validateRequest(
    contractName: string,
    method: string,
    path: string,
  ): { valid: boolean; errors: string[] } {
    const contract = this.contracts.get(contractName);
    if (!contract) {
      return { valid: false, errors: [`Contract "${contractName}" not found`] };
    }

    const errors: string[] = [];

    if (contract.request.method !== method.toUpperCase()) {
      errors.push(`Expected method ${contract.request.method}, got ${method}`);
    }

    if (contract.request.path !== path) {
      errors.push(`Expected path ${contract.request.path}, got ${path}`);
    }

    return { valid: errors.length === 0, errors };
  }

  getAllContracts(): string[] {
    return Array.from(this.contracts.keys());
  }

  clear(): void {
    this.contracts.clear();
  }
}

export const contractValidator = new ContractValidator();
