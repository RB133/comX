import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

  // Comma-separated list of allowed browser origins, e.g.
  // "http://localhost:5173,https://comx.vercel.app"
  FRONTEND_URL: z.string().optional(),

  // Optional integrations — the server runs without them, and the
  // features that need them return a clear error instead of crashing.
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  LIVEKIT_API_KEY: z.string().optional(),
  LIVEKIT_API_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  console.error(`Invalid environment configuration:\n${issues}`);
  console.error("Copy .env.example to .env and fill in the missing values.");
  process.exit(1);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";

const defaultOrigins = ["http://localhost:5173"];
export const corsOrigins = Array.from(
  new Set([
    ...(env.FRONTEND_URL?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? []),
    ...defaultOrigins,
  ])
);

export const cloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);

export const livekitConfigured = Boolean(env.LIVEKIT_API_KEY && env.LIVEKIT_API_SECRET);
