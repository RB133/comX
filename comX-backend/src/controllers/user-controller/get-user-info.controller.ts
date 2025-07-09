import { Request, Response } from "express";
import { prisma } from "../../config/dbConnect";
import { responseCodes } from "../../utils/response-codes";

export const get_user_info = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      select: {
        name: true,
        email: true,
        username: true,
        avatar: true,
        designation: true,
        registeredAt: true,
        bio: true,
        location: true,
        website: true,
        phone: true,
        skills: true,
        socialLinks: true,
        followers: {
          select: {
            name: true,
            username: true,
            avatar: true
          }
        },
        following: {
          select: {
            name: true,
            username: true,
            avatar: true
          }
        },  
        Task: {
          select: {
            id: true,
            title: true,
            priority: true,
            status: true,
            deadline: true,
            completedDate: true,
            createdAt: true,
          },
        },
        projects: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                deadline: true,
                createdAt: true,
              },
            },
          },
        },
      },
      where: {
        username: req.params.username,
      },
    });
    if (!user) {
      return responseCodes.clientError.badRequest(res, "user not found");
    }
    return responseCodes.success.ok(res, user);
  } catch (e) {
    console.log(e);
    return responseCodes.serverError.internalServerError(
      res,
      "internal server error"
    );
  }
};
