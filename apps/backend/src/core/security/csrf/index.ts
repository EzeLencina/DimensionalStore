import { CSRF_DEFAULTS } from '../constants';

export interface CsrfOptions {
  readonly cookieName: string;
  readonly headerName: string;
  readonly cookieOptions: {
    readonly httpOnly: boolean;
    readonly secure: boolean;
    readonly sameSite: 'strict' | 'lax' | 'none';
    readonly path: string;
  };
}

export interface CsrfToken {
  readonly token: string;
  readonly expiresAt: Date;
}

export class CsrfArchitecture {
  private readonly options: CsrfOptions;

  constructor(options?: Partial<CsrfOptions>) {
    this.options = {
      ...CSRF_DEFAULTS,
      cookieOptions: {
        ...CSRF_DEFAULTS.cookieOptions,
        secure: process.env['NODE_ENV'] === 'production',
      },
      ...options,
    };
  }

  getOptions(): CsrfOptions {
    return { ...this.options };
  }

  getCookieName(): string {
    return this.options.cookieName;
  }

  getHeaderName(): string {
    return this.options.headerName;
  }

  createToken(): CsrfToken {
    const buf = new Uint8Array(32);
    crypto.getRandomValues(buf);
    const token = Array.from(buf)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const expiresAt = new Date(Date.now() + 86_400_000);
    return { token, expiresAt };
  }

  getCookieOptions() {
    return { ...this.options.cookieOptions };
  }
}
