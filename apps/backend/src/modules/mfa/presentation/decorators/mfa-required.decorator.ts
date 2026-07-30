import { SetMetadata } from '@nestjs/common';

export const MFA_CHECK_KEY = 'mfa_check';

export const MfaRequired = () => SetMetadata(MFA_CHECK_KEY, true);
