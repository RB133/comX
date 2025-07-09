import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const edit_project_info = async (req: Request, res: Response) => {
    try {
        const { projectId, name, description, deadline } = req.body;

        // Build the data object only with fields that are provided
        const data: { name?: string; description?: string; deadline?: Date } = {};
        if (name) data.name = name;
        if (description) data.description = description;
        if (deadline) data.deadline = deadline;

        // Check if there's anything to update
        if (Object.keys(data).length === 0) {
            return responseCodes.clientError.badRequest(res, "No fields to update");
        }

        // Update the project
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: data,
        });

        return responseCodes.success.ok(res, updatedProject, "project info updated");
    } catch (e) {
        console.log(e);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
};
