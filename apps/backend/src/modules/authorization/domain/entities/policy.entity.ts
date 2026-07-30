import { PolicyId } from '../value-objects/policy-id.value-object';
import { PolicyRule, Effect } from '../types';

export class Policy {
  private readonly id: PolicyId;
  private name: string;
  private description: string;
  private rules: PolicyRule[];
  private priority: number;
  private enabled: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id?: PolicyId;
    name: string;
    description?: string;
    rules: PolicyRule[];
    priority?: number;
    enabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? new PolicyId();
    this.name = params.name;
    this.description = params.description ?? '';
    this.rules = [...params.rules];
    this.priority = params.priority ?? 0;
    this.enabled = params.enabled ?? true;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  getId(): PolicyId { return this.id; }
  getName(): string { return this.name; }
  getDescription(): string { return this.description; }
  getRules(): PolicyRule[] { return [...this.rules]; }
  getPriority(): number { return this.priority; }
  isEnabled(): boolean { return this.enabled; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  setName(name: string): void { this.name = name; this.touch(); }
  setDescription(description: string): void { this.description = description; this.touch(); }
  setPriority(priority: number): void { this.priority = priority; this.touch(); }
  enable(): void { this.enabled = true; this.touch(); }
  disable(): void { this.enabled = false; this.touch(); }

  addRule(rule: PolicyRule): void {
    this.rules.push(rule);
    this.touch();
  }

  removeRule(index: number): void {
    if (index >= 0 && index < this.rules.length) {
      this.rules.splice(index, 1);
      this.touch();
    }
  }

  evaluate(resource: string, action: string): Effect | null {
    for (const rule of this.rules) {
      if (rule.resource === resource && rule.actions.includes(action as any)) {
        return rule.effect;
      }
    }
    return null;
  }

  private touch(): void { this.updatedAt = new Date(); }
}
