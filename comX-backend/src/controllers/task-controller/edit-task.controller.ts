import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";
import { Priority } from "@prisma/client";

export const edit_task = async (req: Request, res: Response) => {
    try {
        const { taskId, title, description, referenceLinks, milestone, priority, deadline, projectId, assignId } = req.body;

        if (!taskId) {
            return responseCodes.clientError.badRequest(res, "taskId is a required parameter.");
        }

        // Check if task exists
        const existingTask = await prisma.task.findUnique({
            where: { id: Number(taskId) },
        });
        if (!existingTask) {
            return responseCodes.clientError.notFound(res, "Task not found.");
        }

        // Validate priority
        const validPriorities = Object.values(Priority);
        if (priority && !validPriorities.includes(priority)) {
            return responseCodes.clientError.badRequest(res, `Invalid priority. Accepted values are: ${validPriorities.join(", ")}`);
        }

        // Update task
        const updatedTask = await prisma.task.update({
            where: { id: Number(taskId) },
            data: {
                title: title || existingTask.title,
                description: description || existingTask.description,
                referenceLinks: referenceLinks || existingTask.referenceLinks,
                milestone: milestone || existingTask.milestone,
                priority: priority || existingTask.priority,
                deadline: deadline || existingTask.deadline,
                projectId: projectId || existingTask.projectId,
                assignId: assignId || existingTask.assignId,
            },
        });

        return responseCodes.success.ok(res, updatedTask, "Task updated successfully.");
    } catch (error) {
        console.error(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
};
