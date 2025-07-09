import { z } from "zod";

export const getCommunityMembersSchema = z.object({
    communityId: z.number()
})
  
export type getCommunityMembersRequest = z.infer<typeof getCommunityMembersSchema>;

export const joinCommunitySchema = z.object({
    userId: z.number(),
    joincode: z.string().length(8, "not valid, joincode must be of 8 characters")
})
  
export type joinCommunityRequest = z.infer<typeof joinCommunitySchema>;

export const promoteMemberSchema = z.object({
    userId: z.number(), 
    communityId: z.number(), 
    promoting_id: z.number()
})

export type promoteMemberRequest = z.infer<typeof promoteMemberSchema>;

export const demoteMemberSchema = z.object({
    userId: z.number(), 
    communityId: z.number(), 
    demoting_id: z.number()
})

export type demoteMemberRequest = z.infer<typeof demoteMemberSchema>;

export const removeMemberSchema = z.object({
    userId: z.number(), 
    communityId: z.number(), 
    removingId: z.number()
})

export type removeMemberRequest = z.infer<typeof removeMemberSchema>;

export const acceptJoinRequestSchema = z.object({
    userId: z.number(), 
    communityId: z.number(), 
    member_id: z.number()
})

export type acceptJoinRequestRequest = z.infer<typeof acceptJoinRequestSchema>;

export const banMemberSchema = z.object({
    userId: z.number(), 
    communityId: z.number(), 
    baning_id: z.number()
})

export type banMemberRequest = z.infer<typeof banMemberSchema>;
