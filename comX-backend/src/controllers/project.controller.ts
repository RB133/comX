import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError, asyncHandler, created, ok } from "../utils/http";

const memberSelect = { id: true, name: true, username: true, email: true, avatar: true, designation: true };

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { communityId, name, description, deadline, milestones, members } = req.body;

  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime()) || deadlineDate < new Date()) {
    throw new HttpError(400, "not a valid deadline");
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      communityId,
      ownerId: req.userId,
      deadline: deadlineDate,
      milestones: milestones ?? [],
    },
  });

  // The creator is always a member, alongside everyone they selected.
  const memberIds: number[] = [req.userId, ...(members ?? [])];
  await prisma.projectMembers.createMany({
    data: memberIds.map((userId) => ({ communityId, projectId: project.id, userId })),
    skipDuplicates: true,
  });

  created(res, project, "created project successfully");
});

export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const communityId = Number(req.params.communityId);

  const memberships = await prisma.projectMembers.findMany({
    where: { userId: req.userId, communityId },
    include: { project: true },
  });

  ok(res, memberships.map((m) => m.project), "all projects fetched");
});

export const getProjectDetails = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: memberSelect },
      projectMembers: { include: { user: { select: memberSelect } } },
    },
  });
  if (!project) {
    throw new HttpError(404, "no such project found");
  }

  ok(res, { ...project, projectMembers: project.projectMembers.map((m) => m.user) }, "project details fetched");
});

export const editProjectInfo = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, name, description, deadline } = req.body;

  const data: { name?: string; description?: string; deadline?: Date } = {};
  if (name) data.name = name;
  if (description) data.description = description;
  if (deadline) data.deadline = new Date(deadline);

  if (Object.keys(data).length === 0) {
    throw new HttpError(400, "No fields to update");
  }

  const updated = await prisma.project.update({ where: { id: projectId }, data });
  ok(res, updated, "project info updated");
});

export const editMembers = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, communityId, add, remove } = req.body;

  await prisma.projectMembers.createMany({
    data: (add ?? []).map((userId: number) => ({ communityId, projectId, userId })),
    skipDuplicates: true,
  });

  await prisma.projectMembers.deleteMany({
    where: { projectId, communityId, userId: { in: remove ?? [] } },
  });

  ok(res, "user added and removed to the project");
});

export const addMilestone = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, milestone } = req.body;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { milestones: true },
  });
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  const milestones = [...project.milestones, milestone];
  await prisma.project.update({ where: { id: projectId }, data: { milestones } });
  ok(res, milestones);
});

export const removeMilestone = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, milestone } = req.body;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { milestones: true },
  });
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  const milestones = project.milestones.filter((m) => m !== milestone);
  await prisma.project.update({ where: { id: projectId }, data: { milestones } });
  ok(res, milestones);
});

export const editMilestones = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, milestones } = req.body;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  const updated = await prisma.project.update({ where: { id: projectId }, data: { milestones } });
  ok(res, updated);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.body;
  await prisma.project.delete({ where: { id: projectId } });
  ok(res, "deleted successfully");
});
