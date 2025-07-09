import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const edit_milestone = async (req: Request, res: Response) => {
    try {
        const { projectId, milestones } = req.body;

        console.log(milestones);

        // Retrieve the current milestones for the project
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return responseCodes.clientError.notFound(res, "Project not found");
        }

        console.log(project);

        // Update the project with the new milestones array
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { milestones: milestones },
        });

        console.log(updatedProject);

        return responseCodes.success.ok(res, updatedProject);
    } catch (e) {
        console.log(e);
        return responseCodes.serverError.internalServerError(res, "An error occurred while editing the milestone");
    }
};
