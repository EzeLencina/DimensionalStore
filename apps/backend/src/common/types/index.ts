import type { ErrorResponse } from '../responses/error-response';
import type { SuccessResponse } from '../responses/success-response';

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
