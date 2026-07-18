import { Scope } from "@prisma/client";
import { z } from "zod";

export const createCommunitySchema = z
  .object({
    name: z.string().min(1),
    description: z.string(),
    scope: z.nativeEnum(Scope).default("PUBLIC"),
  })
  .passthrough();

export const deleteCommunitySchema = z
  .object({
    communityId: z.coerce.number().int().positive(),
  })
  .passthrough();
