import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Error type controllers can throw; the global error handler turns it into
 * a JSON response with the same shape as success responses.
 */
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly data: unknown = undefined
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/** All responses share the shape { status, message, data? }. */
export const ok = (res: Response, data: unknown, message = "Success") =>
  res.status(200).json({ status: 200, message, data });

export const created = (res: Response, data: unknown, message = "Resource created successfully") =>
  res.status(201).json({ status: 201, message, data });

/**
 * Wraps an async route handler so thrown errors (including HttpError)
 * reach the global error handler instead of crashing the process.
 */
export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next).catch(next);
  };
