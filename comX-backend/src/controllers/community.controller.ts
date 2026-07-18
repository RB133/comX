import crypto from "crypto";
import { Request, Response } from "express";
import { AccessToken } from "livekit-server-sdk";
import { env, livekitConfigured } from "../config/env";
import { uploadImage } from "../lib/cloudinary";
import { prisma } from "../lib/prisma";
import { HttpError, asyncHandler, created, ok } from "../utils/http";

const ownerSelect = { id: true, name: true, username: true, email: true, avatar: true, designation: true };

async function generateUniqueJoinCode(): Promise<string> {
  // 8 hex chars ≈ 4 billion combinations; retry on the rare collision.
  for (;;) {
    const joinCode = crypto.randomBytes(4).toString("hex");
    const existing = await prisma.community.findUnique({ where: { joinCode } });
    if (!existing) return joinCode;
  }
}

export const createCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, scope } = req.body;

  const existing = await prisma.community.findUnique({ where: { name } });
  if (existing) {
    throw new HttpError(400, "Community name must be unique");
  }

  const community = await prisma.community.create({
    data: {
      name,
      description,
      scope,
      joinCode: await generateUniqueJoinCode(),
      members: { create: { userId: req.userId, role: "OWNER" } },
    },
    include: { members: true },
  });

  const members = community.members.map(({ id, communityId, ...rest }) => rest);
  const owner = { ...community.members.find((m) => m.role === "OWNER"), id: undefined, communityId: undefined };

  created(res, { ...community, members, memberCount: members.length, owner }, "Community created successfully");
});

export const getAllCommunities = asyncHandler(async (_req: Request, res: Response) => {
  const communities = await prisma.community.findMany({
    include: {
      _count: { select: { members: true } },
      members: { where: { role: "OWNER" }, include: { user: { select: ownerSelect } } },
    },
  });

  const formatted = communities.map(({ _count, members, ...community }) => ({
    ...community,
    memberCount: _count.members,
    owner: members[0]?.user ?? null,
  }));

  ok(res, formatted, "Communities fetched successfully");
});

export const getCommunityDetails = asyncHandler(async (req: Request, res: Response) => {
  const community = await prisma.community.findUnique({
    where: { id: Number(req.params.communityId) },
  });
  ok(res, community, "Community details fetched");
});

export const getUserCommunities = asyncHandler(async (req: Request, res: Response) => {
  const memberships = await prisma.communityMember.findMany({
    where: { userId: req.userId, role: { notIn: ["QUEUE", "BANNED"] } },
    include: {
      community: {
        include: {
          _count: { select: { members: true } },
          members: { where: { role: "OWNER" }, include: { user: { select: ownerSelect } } },
        },
      },
    },
  });

  const communities = memberships.map(({ community }) => {
    const { _count, ...rest } = community;
    return {
      ...rest,
      owner: community.members[0]?.user ?? null,
      memberCount: _count.members,
    };
  });

  ok(res, communities, "all user communities");
});

export const updateCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, scope } = req.body;
  const communityId = Number(req.body.communityId);

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community) {
    throw new HttpError(404, "Community not found");
  }

  const data: { name?: string; description?: string; scope?: "PUBLIC" | "PRIVATE"; coverImage?: string } = {};

  if (name) {
    const existing = await prisma.community.findUnique({ where: { name } });
    if (existing && existing.id !== communityId) {
      throw new HttpError(400, "Community name must be unique");
    }
    data.name = name;
  }
  if (description) data.description = description;
  if (scope) data.scope = scope;
  if (req.file) data.coverImage = await uploadImage(req.file.path);

  if (Object.keys(data).length === 0) {
    throw new HttpError(400, "No valid fields provided for update");
  }

  const updated = await prisma.community.update({ where: { id: communityId }, data });
  ok(res, updated, "Community updated successfully");
});

export const deleteCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.body;

  const membership = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId: req.userId, communityId } },
  });
  if (!membership || membership.role !== "OWNER") {
    throw new HttpError(403, "Only the owner can delete this community");
  }

  await prisma.community.delete({ where: { id: communityId } });
  ok(res, null, "Community deleted successfully");
});

export const getLivekitToken = asyncHandler(async (req: Request, res: Response) => {
  if (!livekitConfigured) {
    throw new HttpError(503, "Video calls are not configured on this server (missing LiveKit credentials)");
  }

  const { roomName, identity } = req.body;
  if (!roomName) {
    throw new HttpError(400, "roomName is required");
  }

  const token = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: String(identity ?? req.userId),
  });
  token.addGrant({ room: roomName, roomJoin: true, canPublish: true, canSubscribe: true });

  // The LiveKit client expects a bare { token } payload.
  res.json({ token: await token.toJwt() });
});
