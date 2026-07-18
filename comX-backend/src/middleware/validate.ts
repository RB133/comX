import { RequestHandler } from "express";
import { ZodType } from "zod";

/** Validates req.body against a zod schema; replaces it with the parsed value. */
export const validate =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        status: 400,
        message: "Validation failed",
        data: result.error.errors,
      });
      return;
    }
    // Keep userId set by requireAuth even if the schema strips it.
    req.body = { ...(result.data as object), userId: req.userId };
    next();
  };
