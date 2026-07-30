export class ValidateCredentialsCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
