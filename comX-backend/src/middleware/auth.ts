import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env, isProduction } from "../config/env";
import { prisma } from "../lib/prisma";
import { HttpError, asyncHandler } from "../utils/http";

const TOKEN_COOKIE = "token";
const TOKEN_TTL_DAYS = 30;

export function setAuthCookie(res: Response, userId: number) {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: `${TOKEN_TTL_DAYS}d` });
  res.cookie(TOKEN_COOKIE, token, {
    maxAge: TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // In production the frontend and backend live on different domains, so the
    // cookie must be SameSite=None + Secure. Locally that combination is
    // rejected over plain http, so we relax it.
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(TOKEN_COOKIE, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
}

/** Verifies a raw JWT and returns the user id it carries, or null. */
export function verifyToken(token: string | undefined): number | null {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId?: number };
    return typeof payload.userId === "number" ? payload.userId : null;
  } catch {
    return null;
  }
}

/**
 * Requires a valid JWT cookie. Attaches the user id as req.userId and also
 * as req.body.userId so handlers can never be spoofed by a client-sent id.
 */
export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const userId = verifyToken(req.cookies?.[TOKEN_COOKIE]);
  if (userId === null) {
    throw new HttpError(401, "Unauthorized: invalid or missing token");
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) {
    throw new HttpError(401, "Unauthorized: user no longer exists");
  }

  req.userId = userId;
  if (req.body && typeof req.body === "object") {
    req.body.userId = userId;
  }
  next();
});
