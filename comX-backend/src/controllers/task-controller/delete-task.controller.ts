import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const delete_task = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.body;

        await prisma.task.delete({
            where: {
                id: taskId,
            }
        })

        return responseCodes.success.ok(res, "task deleted")
    } catch (error) {
        console.error(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
}