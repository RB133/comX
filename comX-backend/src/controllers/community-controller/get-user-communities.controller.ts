import { Request, Response } from "express";
import { prisma } from "../../config/dbConnect";
import { responseCodes } from "../../utils/response-codes";

export const get_user_communities = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const userCommunities = await prisma.communityMember.findMany({
      where: {
        userId: userId,
        role: {
          not: "QUEUE"
        }
      },
      include: {
        community: {
          include: {
            members: {
              where: {
                role: 'OWNER', // Find the owner
              },
              include: {
                user: true, // Include the owner user details
              },
            },
          },
        },
      },
    });

    // Map and fetch member counts for each community
    const communitiesWithOwners = await Promise.all(
      userCommunities.map(async (membership) => {
        const community = membership.community;

        // Get the owner details from the members array
        const owner = community.members.length > 0 ? community.members[0].user : null;

        // Get the member count for the community
        const memberCount = await prisma.communityMember.count({
          where: { communityId: community.id },
        });

        return {
          ...community, // Include community details
          owner,        // Add the owner details
          memberCount,  // Add member count
        };
      })
    );

    return responseCodes.success.ok(res, communitiesWithOwners, "all user communities");
  } catch (error) {
    console.log("Error fetching user communities:", error);
    return responseCodes.serverError.internalServerError(res, "internal server error");
  }
};
