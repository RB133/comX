import { Request, Response } from "express";
import { SocialLinks } from "@prisma/client";
import { uploadImage } from "../lib/cloudinary";
import { prisma } from "../lib/prisma";
import { HttpError, asyncHandler, ok } from "../utils/http";

const previewSelect = { name: true, username: true, avatar: true };

export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    select: {
      name: true,
      email: true,
      username: true,
      avatar: true,
      designation: true,
      registeredAt: true,
      bio: true,
      location: true,
      website: true,
      phone: true,
      skills: true,
      socialLinks: true,
      followers: { select: previewSelect },
      following: { select: previewSelect },
      Task: {
        select: {
          id: true,
          title: true,
          priority: true,
          status: true,
          deadline: true,
          completedDate: true,
          createdAt: true,
        },
      },
      projects: {
        select: {
          project: {
            select: { id: true, name: true, description: true, deadline: true, createdAt: true },
          },
        },
      },
    },
  });
  if (!user) {
    throw new HttpError(400, "user not found");
  }
  ok(res, user);
});

export const editUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const { designation, bio, location, website, phone, skills, socialLinks } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  if (user.id !== req.userId) {
    throw new HttpError(403, "You can only edit your own profile");
  }

  if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
    throw new HttpError(400, "Invalid phone number format");
  }
  if (skills && !Array.isArray(skills)) {
    throw new HttpError(400, "Skills must be an array");
  }
  if (socialLinks) {
    const valid =
      Array.isArray(socialLinks) &&
      socialLinks.every((link: string) => Object.values(SocialLinks).includes(link as SocialLinks));
    if (!valid) {
      throw new HttpError(400, `Invalid social links. Allowed values: ${Object.values(SocialLinks).join(", ")}`);
    }
  }

  const avatar = req.file ? await uploadImage(req.file.path) : undefined;

  const updated = await prisma.user.update({
    where: { username },
    data: { designation, bio, location, website, phone, skills, socialLinks, avatar },
    select: {
      name: true,
      email: true,
      avatar: true,
      username: true,
      designation: true,
      bio: true,
      location: true,
      website: true,
      phone: true,
      skills: true,
      socialLinks: true,
    },
  });

  ok(res, updated);
});

export const toggleFollow = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  const targetUser = await prisma.user.findUnique({ where: { username } });
  if (!targetUser) {
    throw new HttpError(404, "Target user not found");
  }
  if (targetUser.id === req.userId) {
    throw new HttpError(400, "You cannot follow / unfollow yourself");
  }

  const alreadyFollowing = await prisma.user.findFirst({
    where: { id: req.userId, following: { some: { id: targetUser.id } } },
    select: { id: true },
  });

  await prisma.user.update({
    where: { id: req.userId },
    data: {
      following: alreadyFollowing
        ? { disconnect: { id: targetUser.id } }
        : { connect: { id: targetUser.id } },
    },
  });

  ok(res, alreadyFollowing ? "User unfollowed successfully" : "User followed successfully");
});
