import { Request, Response } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { HttpError, asyncHandler, ok } from "../utils/http";

function getMembership(userId: number, communityId: number) {
  return prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });
}

function setRole(userId: number, communityId: number, role: Role) {
  return prisma.communityMember.update({
    where: { userId_communityId: { userId, communityId } },
    data: { role },
  });
}

export const getCommunityMembers = asyncHandler(async (req: Request, res: Response) => {
  const communityId = Number(req.params.communityId);

  const community = await prisma.community.findUnique({
    where: { id: communityId },
    include: {
      members: {
        select: {
          role: true,
          joinedAt: true,
          user: {
            select: { id: true, name: true, email: true, username: true, designation: true, avatar: true },
          },
        },
      },
    },
  });
  if (!community) {
    throw new HttpError(404, "Community not found");
  }

  const members = community.members.map(({ user, role, joinedAt }) => ({ ...user, role, joinedAt }));
  ok(res, { members }, "Fetched community members successfully");
});

export const joinCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { joinCode } = req.body;
  if (!joinCode) {
    throw new HttpError(400, "join code is required");
  }

  const community = await prisma.community.findUnique({ where: { joinCode } });
  if (!community) {
    throw new HttpError(404, "Invalid join code");
  }

  const existing = await getMembership(req.userId, community.id);
  if (existing) {
    if (existing.role === "BANNED") {
      throw new HttpError(400, "You are banned from the community", {});
    }
    throw new HttpError(400, "User is already a member of the community", {});
  }

  // Public communities admit immediately; private ones queue a join request.
  const role: Role = community.scope === "PUBLIC" ? "MEMBER" : "QUEUE";
  await prisma.communityMember.create({
    data: { userId: req.userId, communityId: community.id, role },
  });

  if (role === "MEMBER") {
    ok(res, { communityId: community.id }, "Joined the community successfully");
  } else {
    ok(res, "Join request Sent");
  }
});

export const acceptJoinRequest = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.body;
  const memberId = Number(req.body.memberId ?? req.body.member_id);
  if (!memberId) {
    throw new HttpError(400, "memberId is required");
  }

  const member = await getMembership(memberId, communityId);
  if (!member || member.role !== "QUEUE") {
    throw new HttpError(403, "The person you are trying to accept is not in queue");
  }

  const updated = await prisma.communityMember.update({
    where: { userId_communityId: { userId: memberId, communityId } },
    data: { role: "MEMBER", joinedAt: new Date() },
  });
  ok(res, updated, "user is now a member");
});

export const promoteMember = asyncHandler(async (req: Request, res: Response) => {
  const { communityId, promoting_id } = req.body;

  const member = await getMembership(promoting_id, communityId);
  if (!member) {
    throw new HttpError(403, "The person you are trying to promote is not a member of this community");
  }
  if (member.role !== "MEMBER") {
    throw new HttpError(403, "The person you are trying to promote is not a member");
  }

  ok(res, await setRole(promoting_id, communityId, "ADMIN"), "user is promoted");
});

export const demoteMember = asyncHandler(async (req: Request, res: Response) => {
  const { communityId, demoting_id } = req.body;

  const member = await getMembership(demoting_id, communityId);
  if (!member) {
    throw new HttpError(403, "The person you are trying to demote is not a member of this community");
  }
  if (member.role !== "ADMIN") {
    throw new HttpError(403, "The person you are trying to demote is not an admin");
  }

  ok(res, await setRole(demoting_id, communityId, "MEMBER"), "user is demoted");
});

export const banMember = asyncHandler(async (req: Request, res: Response) => {
  const { communityId, baning_id } = req.body;

  const member = await getMembership(baning_id, communityId);
  if (!member) {
    throw new HttpError(403, "The person you are trying to ban is not a member of this community");
  }
  if (member.role !== "MEMBER") {
    throw new HttpError(403, "The person you are trying to ban is not a member");
  }

  ok(res, await setRole(baning_id, communityId, "BANNED"), "user is banned");
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const { removingId, communityId } = req.body;

  const member = await getMembership(removingId, communityId);
  if (!member) {
    throw new HttpError(400, "Member not found in this community");
  }
  if (member.role === "OWNER") {
    throw new HttpError(403, "The community owner cannot be removed");
  }

  await prisma.communityMember.delete({ where: { id: member.id } });
  ok(res, null, "Member removed successfully");
});
