import { Request, Response } from 'express';
import { prisma } from '../../config/dbConnect';
import { responseCodes } from '../../utils/response-codes';
import { isUserMember } from '../../utils/is-user-member';

// Remove a member from a community
export const remove_member = async (req: Request, res: Response) => {
  try {
    const { removingId, communityId } = req.body;

    // Find the specific community member to be removed
    const memberToRemove = await isUserMember(removingId, communityId);

    if (!memberToRemove) {
      return responseCodes.clientError.badRequest(res, 'Member not found in this community');
    }

    // Remove the member from the community
    await prisma.communityMember.delete({
      where: {
        id: memberToRemove.id, // The ID of the member to remove
      },
    });

    return responseCodes.success.ok(res, null, 'Member removed successfully');
  } catch (error) {
    console.error('Error removing member:', error);
    return responseCodes.serverError.internalServerError(res, 'Internal server error');
  }
};
