import { Request, response, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const get_all_tasks_in_community = async(req: Request, res: Response) => {
    try{
        const { communityId } = req.params;
        const { userId } = req.body;

        if (!userId || !communityId) {
            return responseCodes.clientError.badRequest(
                res,
                "userId and communityId are required"
            );
        }

        const userProjects = await prisma.projectMembers.findMany({
            where: {
                userId: Number(userId),
                communityId: Number(communityId),
            },
            select: {
                project: {
                    select: {
                        id: true,
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

        if (!userProjects.length) {
            return responseCodes.clientError.notFound(
                res,
                "No projects found for the user in the specified community"
            );
        }

        const tasks = userProjects.flatMap((projectMember) => projectMember.project.tasks);

        return responseCodes.success.ok(res, tasks);
    }
    catch(e){
        console.log(e);
        return responseCodes.serverError.internalServerError(res, "internal server error");
    }
}