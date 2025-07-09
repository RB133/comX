import { Request, Response } from "express";
import { prisma } from "../../config/dbConnect";
import { responseCodes } from "../../utils/response-codes";

export const toggle_follow = async (req: Request, res: Response) => {
  try {
    const { username } = req.params; // Target user to follow/unfollow
    const {userId} = req.body;

    if (!username) {
      return responseCodes.clientError.badRequest(res, "Username is required");
    }

    // Check if the target user exists
    const targetUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!targetUser) {
      return responseCodes.clientError.notFound(res, "Target user not found");
    }

    const currentUser = await prisma.user.findUnique({where:{id: userId}});4

    if(!currentUser){
      return responseCodes.clientError.unauthorized(res, "You are not authorized for this action");
    }

    // Ensure the current user is not trying to follow/unfollow themselves
    if (currentUser.username === targetUser.username) {
      return responseCodes.clientError.badRequest(res, "You cannot follow / unfollow yourself");
    }

    // Check if the current user is already following the target user
    const isFollowing = await prisma.user
      .findUnique({
        where: { username: currentUser.username },
      })
      .following({
        where: { username: targetUser.username },
      });

    if(!isFollowing){
        return responseCodes.clientError.notFound(res, "user not found");
    }

    if (isFollowing.length > 0) {
      // If already following, unfollow (remove the relation)
      await prisma.user.update({
        where: { username: currentUser.username },
        data: {
          following: {
            disconnect: {
              username: targetUser.username,
            },
          },
        },
      });

      return responseCodes.success.ok(res, "User unfollowed successfully");
    } else {
      await prisma.user.update({
        where: { username: currentUser.username },
        data: {
          following: {
            connect: {
              username: targetUser.username,
            },
          },
        },
      });

      return responseCodes.success.ok(res, "User followed successfully");
    }
  } catch (e) {
    console.error(e);
    return responseCodes.serverError.internalServerError(res, "Internal server error");
  }
};
