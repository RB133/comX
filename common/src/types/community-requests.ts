import { z } from "zod";
import { Scope } from "./utils";

export const createCommunitySchema = z.object({
    name: z.string(), 
    description: z.string(), 
    scope: z.nativeEnum(Scope),
    userId: z.number(), 
})
  
export type createCommunityRequest = z.infer<typeof createCommunitySchema>;

export const deleteCommunitySchema = z.object({
    communityId: z.number(),
    userId: z.number(),
})
  
export type deleteCommunityRequest = z.infer<typeof deleteCommunitySchema>;

export const updateCommunitySchema = z.object({
    name: z.string().optional(), 
    description: z.string().optional(), 
    scope: z.nativeEnum(Scope).optional(),
    userId: z.number(), 
    communityId: z.number() 
})
  
export type updateCommunityRequest = z.infer<typeof updateCommunitySchema>;
