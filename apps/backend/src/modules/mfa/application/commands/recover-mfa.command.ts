export class StartRecoveryCommand {
  constructor(public readonly userId: string) {}
}

export class CompleteRecoveryCommand {
  constructor(
    public readonly userId: string,
    public readonly token: string,
  ) {}
}
