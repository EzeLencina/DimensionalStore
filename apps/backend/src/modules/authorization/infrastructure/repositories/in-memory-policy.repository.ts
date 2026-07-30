import { Injectable } from '@nestjs/common';
import { IPolicyRepository } from '../../application/interfaces';
import { Policy } from '../../domain/entities/policy.entity';

@Injectable()
export class InMemoryPolicyRepository implements IPolicyRepository {
  private readonly policies: Map<string, Policy> = new Map();

  async save(policy: Policy): Promise<void> {
    this.policies.set(policy.getId().getValue(), policy);
  }

  async findById(id: string): Promise<Policy | null> {
    return this.policies.get(id) ?? null;
  }

  async findByName(name: string): Promise<Policy | null> {
    for (const policy of this.policies.values()) {
      if (policy.getName() === name) return policy;
    }
    return null;
  }

  async findAll(): Promise<Policy[]> {
    return Array.from(this.policies.values());
  }

  async delete(id: string): Promise<void> {
    this.policies.delete(id);
  }
}
