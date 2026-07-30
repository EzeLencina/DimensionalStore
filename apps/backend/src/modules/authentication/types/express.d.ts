declare namespace Express {
  interface User {
    userId: string;
    email: string;
    sessionId?: string;
  }

  interface Request {
    user?: User;
  }
}
