export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name?: string,
    public readonly slug?: string,
    public readonly shortDescription?: string | null,
    public readonly description?: string | null,
    public readonly warrantyMonths?: number | null,
    public readonly seoTitle?: string | null,
    public readonly seoDescription?: string | null,
    public readonly condition?: string,
  ) {}
}
