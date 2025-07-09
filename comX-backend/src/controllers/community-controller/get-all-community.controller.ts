import { Request, Response } from 'express';
import { prisma } from '../../config/dbConnect';
import { responseCodes } from '../../utils/response-codes';

async function getOwner(ownerId: any) {
  const owner = await prisma.user.findUnique({
    select:{
      name: true,
      email:true,
      id:true,
      avatar: true
    },
    where: {
      id: ownerId?.userId,
    },
  });
  return owner;
}

// Get all communities
export const get_all_communities = async (req: Request, res: Response) => {
  try {
    // Fetch all communities with their members
    const communities = await prisma.community.findMany({
      include: {
        members: true, // Include the members of each community
      },
    });

    // Use Promise.all to handle asynchronous operations in map
    const formattedCommunities = await Promise.all(
      communities.map(async (community) => {
        const memberCount = community.members.length;

        // Find the owner
        const ownerId = community.members.find((member) => member.role === 'OWNER');
        console.log('ownerId ' + ownerId?.userId);

        // Fetch the owner details asynchronously
        const owner = await getOwner(ownerId);

        return {
          ...community,
          members: undefined, // Replace members with the modified array
          memberCount, // Add member count to the community data
          owner: owner || null, // Add the owner details or null if not found
        };
      })
    );

    return responseCodes.success.ok(res, formattedCommunities, 'Communities fetched successfully');
  } catch (error) {
    console.error('Error fetching communities:', error);
    return responseCodes.serverError.internalServerError(res, 'Internal server error');
  }
};
