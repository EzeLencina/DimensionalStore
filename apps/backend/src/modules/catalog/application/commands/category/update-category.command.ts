export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name?: string,
    public readonly slug?: string,
    public readonly parentId?: string | null,
    public readonly description?: string | null,
    public readonly shortDescription?: string | null,
    public readonly displayOrder?: number,
    public readonly icon?: string | null,
    public readonly image?: string | null,
    public readonly seoTitle?: string | null,
    public readonly seoDescription?: string | null,
  ) {}
}
