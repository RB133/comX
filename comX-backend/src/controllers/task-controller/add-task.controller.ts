import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";
import { Priority } from "@prisma/client";

export const add_task = async (req: Request, res: Response) => {
    try {
        const { title, description, referenceLinks, milestone, priority, deadline, createdAt, content, projectId, assignId } = req.body;

        //check if assignId is in project

        if (!title || !deadline || !projectId || !assignId) {
            return responseCodes.clientError.badRequest(res, "Title, deadline, projectId, and userId are required fields.");
        }

        const validPriorities = Object.values(Priority);
        if (priority && !validPriorities.includes(priority)) {
            return responseCodes.clientError.badRequest(res, `Invalid priority. Accepted values are: ${validPriorities.join(", ")}`);
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                referenceLinks,
                milestone: milestone || "",
                priority,
                deadline,
                content,
                createdAt: createdAt || null,
                projectId,
                assignId: assignId,
            },
        });

        return responseCodes.success.ok(res, task, "task created")
    } catch (error) {
        console.error(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
}