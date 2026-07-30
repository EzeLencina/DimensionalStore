import { Policy } from '../../domain/entities/policy.entity';

export interface IPolicyRepository {
  save(policy: Policy): Promise<void>;
  findById(id: string): Promise<Policy | null>;
  findByName(name: string): Promise<Policy | null>;
  findAll(): Promise<Policy[]>;
  delete(id: string): Promise<void>;
}
