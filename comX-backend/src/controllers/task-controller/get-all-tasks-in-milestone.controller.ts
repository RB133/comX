import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const get_all_tasks_in_milestone = async (req: Request, res: Response) => {
    try {
        const { projectId, milestone } = req.params; 
        
        const tasks = await prisma.task.findMany({
            where: { 
                projectId: Number(projectId),
                milestone: milestone
            },
            include:{
                user: true
            }
        });

        if (tasks.length === 0) {
            return responseCodes.success.ok(res, [], "No tasks found for this project. for your milestone");
        }

        return responseCodes.success.ok(res, tasks, "Tasks retrieved successfully.");
    } catch (error) {
        console.error(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
};
