import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { HttpError } from "../utils/http";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ status: 404, message: "Route not found" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      ...(error.data !== undefined ? { data: error.data } : {}),
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const fields = (error.meta?.target as string[] | undefined)?.join(", ") ?? "field";
    res.status(400).json({ status: 400, message: `${fields} already exists` });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ status: 500, message: "Internal server error" });
}
