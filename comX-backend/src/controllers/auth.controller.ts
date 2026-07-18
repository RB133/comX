import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { uploadImage } from "../lib/cloudinary";
import { prisma } from "../lib/prisma";
import { clearAuthCookie, setAuthCookie } from "../middleware/auth";
import { HttpError, asyncHandler, created, ok } from "../utils/http";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, email, password, designation } = req.body;

  const avatar = req.file ? await uploadImage(req.file.path) : undefined;
  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, username, email, designation, avatar, password: hashedPassword, isVerified: true },
  });

  setAuthCookie(res, user.id);
  created(res, { ...user, password: "" }, "User created successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] },
  });
  if (!user || !(await bcryptjs.compare(password, user.password))) {
    throw new HttpError(403, "Wrong email/username or password");
  }

  setAuthCookie(res, user.id);
  ok(res, { ...user, password: "" }, "Logged in successfully");
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  ok(res, {}, "Logged out");
});
