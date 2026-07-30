import { PermissionId, Slug, DisplayName } from '../value-objects';

export class Permission {
  private readonly id: PermissionId;
  private readonly resource: string;
  private readonly action: string;
  private name: DisplayName;
  private slug: Slug;
  private description: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id: PermissionId;
    resource: string;
    action: string;
    name: DisplayName;
    slug: Slug;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.resource = params.resource;
    this.action = params.action;
    this.name = params.name;
    this.slug = params.slug;
    this.description = params.description ?? null;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  getId(): PermissionId { return this.id; }
  getResource(): string { return this.resource; }
  getAction(): string { return this.action; }
  getName(): DisplayName { return this.name; }
  getSlug(): Slug { return this.slug; }
  getDescription(): string | null { return this.description; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  updateName(name: DisplayName): void {
    this.name = name;
    this.touch();
  }

  updateSlug(slug: Slug): void {
    this.slug = slug;
    this.touch();
  }

  updateDescription(description: string | null): void {
    this.description = description;
    this.touch();
  }

  getQualifiedName(): string {
    return `${this.resource}:${this.action}`;
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
