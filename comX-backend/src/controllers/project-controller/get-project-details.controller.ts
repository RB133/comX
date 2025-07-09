import { Request, response, Response } from "express";
import { prisma } from "../../config/dbConnect";
import { responseCodes } from "../../utils/response-codes";

export const get_project_details = async (req: Request, res: Response) => {
  try {
    const projectId: number = Number(req.params.projectId);
    if (!projectId) {
      return responseCodes.clientError.badRequest(
        res,
        "projectId not found for finding details"
      );
    }
    const details = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        owner: {
          select: {
            name: true,
            username: true,
            avatar: true,
            email: true,
            designation: true,
          },
        },
        projectMembers: {
          include: {
            user: {
              select: {
                name: true,
                username: true,
                avatar: true,
                email: true,
                designation: true,
                id:true,
              },
            },
          },
        },
      },
    });
    if (!details) {
      return responseCodes.clientError.notFound(res, "no such project found");
    }

    const data = details.projectMembers.map((item) => item.user);

    const data2 = {...details,projectMembers:data};

    return responseCodes.success.ok(res, data2, "project details fetched");
  } catch (e) {
    console.log(e);
    return responseCodes.serverError.internalServerError(
      res,
      "internal server error"
    );
  }
};
