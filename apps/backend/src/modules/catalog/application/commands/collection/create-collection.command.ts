export class CreateCollectionCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description?: string | null,
    public readonly type?: string,
    public readonly status?: string,
    public readonly visibility?: string,
    public readonly displayOrder?: number,
    public readonly startAt?: string | null,
    public readonly endAt?: string | null,
    public readonly seoTitle?: string | null,
    public readonly seoDescription?: string | null,
  ) {}
}
