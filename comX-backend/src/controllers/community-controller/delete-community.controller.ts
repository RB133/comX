import { Request, Response } from 'express';
import { prisma } from '../../config/dbConnect';
import { responseCodes } from '../../utils/response-codes';
import { deleteCommunityRequest, deleteCommunitySchema } from '@prathamjain522/comx-common';
import { bodyParser } from '../../utils/body-parser';

// Delete a community (only the owner can delete)
export const delete_community = async (req: Request, res: Response) => {
  try {
    if(!bodyParser(deleteCommunitySchema, req, res)) return;
    const { communityId, userId }:deleteCommunityRequest = req.body;

    // Fetch the community and its owner
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: true, // Include members to check the owner's role
      },
    });

    // If the community does not exist
    if (!community) {
      return responseCodes.clientError.notFound(res, 'Community not found');
    }

    // Check if the current user is the owner
    const owner = community.members.find(member => member.role === 'OWNER' && member.userId === userId);

    if (!owner) {
      return responseCodes.clientError.forbidden(res, 'Only the owner can delete this community');
    }

    // Delete the community
    await prisma.community.delete({
      where: { id: communityId },
    });

    return responseCodes.success.ok(res, null, 'Community deleted successfully');
  } catch (error) {
    console.error('Error deleting community:', error);
    return responseCodes.serverError.internalServerError(res, 'Internal server error');
  }
};
