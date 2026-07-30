import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MfaException } from '../domain/exceptions';

@Catch(MfaException)
export class MfaExceptionFilter implements ExceptionFilter {
  catch(exception: MfaException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, number> = {
      MFA_NOT_ENABLED: HttpStatus.FORBIDDEN,
      MFA_ALREADY_ENABLED: HttpStatus.CONFLICT,
      MFA_CHALLENGE_EXPIRED: HttpStatus.UNAUTHORIZED,
      MFA_CHALLENGE_INVALID: HttpStatus.UNAUTHORIZED,
      MFA_VERIFICATION_FAILED: HttpStatus.UNAUTHORIZED,
      MFA_INVALID_TOTP_CODE: HttpStatus.UNAUTHORIZED,
      MFA_INVALID_BACKUP_CODE: HttpStatus.UNAUTHORIZED,
      MFA_BACKUP_CODE_ALREADY_USED: HttpStatus.CONFLICT,
      MFA_NO_BACKUP_CODES: HttpStatus.GONE,
      MFA_TRUSTED_DEVICE_EXPIRED: HttpStatus.GONE,
      MFA_TRUSTED_DEVICE_NOT_FOUND: HttpStatus.NOT_FOUND,
      MFA_INVALID_RECOVERY_TOKEN: HttpStatus.UNAUTHORIZED,
      MFA_RECOVERY_TOKEN_EXPIRED: HttpStatus.UNAUTHORIZED,
      MFA_SECRET_GENERATION_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
      MFA_CLOCK_DRIFT_DETECTED: HttpStatus.UNAUTHORIZED,
      MFA_METHOD_NOT_SUPPORTED: HttpStatus.BAD_REQUEST,
      MFA_MAX_ATTEMPTS_EXCEEDED: HttpStatus.TOO_MANY_REQUESTS,
      MFA_ENROLLMENT_NOT_FOUND: HttpStatus.NOT_FOUND,
      MFA_METHOD_ALREADY_ENROLLED: HttpStatus.CONFLICT,
    };

    const status = statusMap[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
