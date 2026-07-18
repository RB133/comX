import { PrismaClient } from "@prisma/client";
import { isProduction } from "../config/env";

export const prisma = new PrismaClient({
  log: isProduction ? ["warn", "error"] : ["warn", "error", "info"],
});
