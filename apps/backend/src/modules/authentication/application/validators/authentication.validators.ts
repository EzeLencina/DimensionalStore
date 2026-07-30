export class AuthenticationValidators {
  static isValidEmail(email: string): boolean {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(email.trim());
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 1;
  }

  static isValidRefreshToken(token: string): boolean {
    return token.length > 0;
  }

  static isValidSessionId(sessionId: string): boolean {
    return sessionId.length > 0;
  }
}
