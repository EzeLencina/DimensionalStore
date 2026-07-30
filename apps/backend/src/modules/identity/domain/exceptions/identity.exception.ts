export class IdentityException extends Error {
  public readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'IdentityException';
    this.code = code;
  }
}
