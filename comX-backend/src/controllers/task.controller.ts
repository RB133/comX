import { Request, Response } from "express";
import { Priority, Status } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { HttpError, asyncHandler, ok } from "../utils/http";

function assertValidPriority(priority: unknown) {
  const valid = Object.values(Priority);
  if (priority && !valid.includes(priority as Priority)) {
    throw new HttpError(400, `Invalid priority. Accepted values are: ${valid.join(", ")}`);
  }
}

export const addTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, referenceLinks, milestone, priority, deadline, content, projectId, assignId } = req.body;

  if (!title || !deadline || !projectId || !assignId) {
    throw new HttpError(400, "Title, deadline, projectId, and assignId are required fields.");
  }
  assertValidPriority(priority);

  const task = await prisma.task.create({
    data: {
      title,
      description,
      referenceLinks: referenceLinks ?? [],
      milestone: milestone || "",
      priority,
      deadline: new Date(deadline),
      content,
      projectId,
      assignId,
    },
  });

  ok(res, task, "task created");
});

export const editTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId, title, description, referenceLinks, milestone, priority, deadline, projectId, assignId } = req.body;

  if (!taskId) {
    throw new HttpError(400, "taskId is a required parameter.");
  }
  assertValidPriority(priority);

  const existing = await prisma.task.findUnique({ where: { id: Number(taskId) } });
  if (!existing) {
    throw new HttpError(404, "Task not found.");
  }

  const updated = await prisma.task.update({
    where: { id: Number(taskId) },
    data: {
      title: title || existing.title,
      description: description || existing.description,
      referenceLinks: referenceLinks || existing.referenceLinks,
      milestone: milestone || existing.milestone,
      priority: priority || existing.priority,
      deadline: deadline ? new Date(deadline) : existing.deadline,
      projectId: projectId || existing.projectId,
      assignId: assignId || existing.assignId,
    },
  });

  ok(res, updated, "Task updated successfully.");
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.body;
  await prisma.task.delete({ where: { id: taskId } });
  ok(res, "task deleted");
});

export const getAllTasksInCommunity = asyncHandler(async (req: Request, res: Response) => {
  const communityId = Number(req.params.communityId);

  const memberships = await prisma.projectMembers.findMany({
    where: { userId: req.userId, communityId },
    select: {
      project: {
        select: {
          tasks: {
            select: {
              id: true,
              title: true,
              priority: true,
              status: true,
              createdAt: true,
              completedDate: true,
              deadline: true,
            },
          },
        },
      },
    },
  });
  if (!memberships.length) {
    throw new HttpError(404, "No projects found for the user in the specified community");
  }

  ok(res, memberships.flatMap((m) => m.project.tasks));
});

export const getAllTasksInProject = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { projectId: Number(req.params.projectId) },
    include: { user: true },
  });
  ok(res, tasks, tasks.length ? "Tasks retrieved successfully." : "No tasks found for this project.");
});

export const getAllTasksInMilestone = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { projectId: Number(req.params.projectId), milestone: req.params.milestone },
    include: { user: true },
  });
  ok(res, tasks, tasks.length ? "Tasks retrieved successfully." : "No tasks found for this milestone.");
});

/** The assignee toggles a task between in-progress and pending-review. */
export const completeTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.body;

  const task = await prisma.task.findFirst({ where: { id: taskId, assignId: req.userId } });
  if (!task) {
    throw new HttpError(400, "You are not assigned this task");
  }
  if (task.status === "COMPLETED") {
    throw new HttpError(400, "task already completed");
  }

  const nextStatus: Status = task.status === "INPROGRESS" ? "PENDING" : "INPROGRESS";
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: nextStatus,
      completedDate: nextStatus === "PENDING" ? new Date() : null,
    },
  });

  ok(res, `Task ${nextStatus}`);
});

/** An admin accepts (completes) or rejects (reopens) a pending task. */
export const taskVerdict = asyncHandler(async (req: Request, res: Response) => {
  const { taskId, verdict } = req.body;

  let status: Status;
  if (verdict === "Accepted") status = "COMPLETED";
  else if (verdict === "Rejected") status = "INPROGRESS";
  else throw new HttpError(400, "not a valid verdict");

  await prisma.task.update({ where: { id: taskId }, data: { status } });
  ok(res, "Task verdict applied.");
});
