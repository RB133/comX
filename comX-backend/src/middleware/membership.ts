import { Request } from "express";
import { prisma } from "../lib/prisma";
import { HttpError, asyncHandler } from "../utils/http";

/** Reads an id that may arrive in the body or as a route param. */
function readId(req: Request, name: string): number {
  const value = Number(req.body?.[name] ?? req.params?.[name]);
  if (!value) {
    throw new HttpError(400, `${name} is required`);
  }
  return value;
}

async function findMembership(userId: number, communityId: number) {
  const membership = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });
  if (!membership) {
    throw new HttpError(404, "You are not a part of this community");
  }
  return membership;
}

/** Allows any accepted member of the community (i.e. not still in the join queue). */
export const requireMember = asyncHandler(async (req, _res, next) => {
  const membership = await findMembership(req.userId, readId(req, "communityId"));
  if (membership.role === "QUEUE") {
    throw new HttpError(403, "Your join request is still pending");
  }
  if (membership.role === "BANNED") {
    throw new HttpError(403, "You are banned from this community");
  }
  next();
});

/** Allows only community admins and the owner. */
export const requireAdmin = asyncHandler(async (req, _res, next) => {
  const membership = await findMembership(req.userId, readId(req, "communityId"));
  if (membership.role !== "ADMIN" && membership.role !== "OWNER") {
    throw new HttpError(403, "You are not an admin of this community");
  }
  next();
});

/** Allows only users assigned to the project within the community. */
export const requireProjectMember = asyncHandler(async (req, _res, next) => {
  const communityId = readId(req, "communityId");
  const projectId = readId(req, "projectId");

  const membership = await prisma.projectMembers.findFirst({
    select: { id: true },
    where: { projectId, communityId, userId: req.userId },
  });
  if (!membership) {
    throw new HttpError(403, "You are not a member of this project");
  }
  next();
});
