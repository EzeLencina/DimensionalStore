export class DisableMfaCommand {
  constructor(
    public readonly userId: string,
    public readonly method?: string,
  ) {}
}
