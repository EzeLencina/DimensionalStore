export class CreateCategoryCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly parentId?: string | null,
    public readonly description?: string | null,
    public readonly shortDescription?: string | null,
    public readonly status?: string,
    public readonly visibility?: string,
    public readonly displayOrder?: number,
    public readonly icon?: string | null,
    public readonly image?: string | null,
    public readonly seoTitle?: string | null,
    public readonly seoDescription?: string | null,
  ) {}
}
