export class AppException extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly details: Record<string, unknown> | null;

  constructor(
    code: string,
    message: string,
    httpStatus = 500,
    details: Record<string, unknown> | null = null,
  ) {
    super(message);
    this.name = 'AppException';
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
  }
}
