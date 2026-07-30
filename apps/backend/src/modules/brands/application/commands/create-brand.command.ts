export class CreateBrandCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly slug?: string,
    public readonly description?: string | null,
    public readonly logoUrl?: string | null,
    public readonly websiteUrl?: string | null,
    public readonly status?: string,
    public readonly visibility?: string,
    public readonly seoTitle?: string | null,
    public readonly seoDescription?: string | null,
  ) {}
}
