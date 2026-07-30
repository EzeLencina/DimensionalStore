export class UpdateVariantCommand {
  constructor(
    public readonly name?: string | null,
    public readonly barcode?: string | null,
  ) {}
}
