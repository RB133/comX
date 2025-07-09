import { Request, Response } from 'express';
import { prisma } from '../../config/dbConnect';
import { responseCodes } from '../../utils/response-codes';
import { Role } from '@prisma/client';

// Add a member to a community using joinCode
export const join_community = async (req: Request, res: Response) => {
  try {
    const { joinCode, userId } = req.body;

    if(!joinCode){
      return responseCodes.clientError.notFound(res, "join code not found");
    }

    // Find the community by joinCode
    const community = await prisma.community.findUnique({
      where: { joinCode },
      include: {
        members: true, // Include current members to check if the user is already a member
      },
    });

    if (!community) {
      return responseCodes.clientError.notFound(res, 'Invalid join code');
    }

    // Check if the user is already a member of the community
    const isAlreadyMember = community.members.find(member => member.userId === userId);
    if (isAlreadyMember) {
      if(isAlreadyMember.role == "BANNED"){
        return responseCodes.clientError.badRequest(res, {}, 'You are banned from the community');
      }
      return responseCodes.clientError.badRequest(res, {}, 'User is already a member of the community');
    }

    let defaultRole:Role = 'QUEUE';
    if(community.scope == 'PUBLIC'){
      defaultRole = 'MEMBER';
    }

    // Add the user as a member
    await prisma.communityMember.create({
      data: {
        userId,
        communityId: community.id,
        role: defaultRole, // By default, the role will be MEMBER
      },
    });

    // Return success response
    if(defaultRole == "MEMBER"){
      return responseCodes.success.ok(res, { communityId: community.id }, 'Joined the community successfully');
    }
    else{
      return responseCodes.success.ok(res, "Join request Sent");
    }
  } catch (error) {
    console.error('Error joining community:', error);
    return responseCodes.serverError.internalServerError(res, 'Internal server error');
  }
};
