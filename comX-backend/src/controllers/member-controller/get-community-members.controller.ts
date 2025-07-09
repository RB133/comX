import { Request, Response } from 'express';
import { prisma } from '../../config/dbConnect';
import { responseCodes } from '../../utils/response-codes';

// Fetch all members of a community by community ID
export const get_community_members = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.communityId; // Assume communityId is passed as a URL parameter

    // Find the community with its members
    const community = await prisma.community.findUnique({
      where: { id: Number(communityId) },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                designation: true,
                avatar: true,
              },
            },
            role: true,
            joinedAt: true
          },
        },
      },
    });

    if (!community) {
      return responseCodes.clientError.notFound(res, 'Community not found');
    }

    // Extracting member data and excluding unnecessary fields
    const members = community.members.map(member => ({
      id: member.user.id,
      name: member.user.name,
      username: member.user.username,
      designation: member.user.designation,
      role: member.role,
      avatar: member.user.avatar,
      email: member.user.email,
      joinedAt: member.joinedAt
    }));

    return responseCodes.success.ok(res, { members }, 'Fetched community members successfully');
  } catch (error) {
    console.error('Error fetching community members:', error);
    return responseCodes.serverError.internalServerError(res, 'Internal server error');
  }
};
