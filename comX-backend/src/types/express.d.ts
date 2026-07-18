declare global {
  namespace Express {
    interface Request {
      /** Set by requireAuth from the verified JWT cookie. */
      userId: number;
    }
  }
}

export {};
