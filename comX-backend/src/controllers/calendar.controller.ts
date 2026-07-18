import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError, asyncHandler, created, ok } from "../utils/http";

export const getCalendarTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await prisma.communityCalendar.findMany({
    where: { communityId: Number(req.params.communityId) },
    select: { id: true, title: true, description: true, startTime: true, endTime: true, color: true },
  });
  ok(res, tasks, "get Tasks");
});

export const setCalendarTask = asyncHandler(async (req: Request, res: Response) => {
  const { communityId, startTime, endTime, title, description, color } = req.body;

  if (!startTime || !endTime || !title || !description || !color) {
    throw new HttpError(400, "all fields are required");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new HttpError(400, "Invalid date format");
  }
  if (start >= end) {
    throw new HttpError(400, "Start time must be earlier than end time");
  }
  if (start <= new Date()) {
    throw new HttpError(400, "Start time must be in the future");
  }

  const task = await prisma.communityCalendar.create({
    data: { userId: req.userId, communityId, title, description, color, startTime: start, endTime: end },
  });
  created(res, task, "Task created");
});
