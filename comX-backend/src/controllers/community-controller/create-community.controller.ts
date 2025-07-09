import { Request, Response } from 'express';
import { prisma } from '../../config/dbConnect';
import { responseCodes } from '../../utils/response-codes'; // Importing response codes
import { v4 as uuidv4 } from 'uuid'; // To generate unique codes
import { createCommunityRequest, createCommunitySchema } from '@prathamjain522/comx-common';
import { bodyParser } from '../../utils/body-parser';

// Function to generate a unique join code
const generateUniqueJoinCode = async (): Promise<string> => {
  let joinCode: string;
  let isUnique = false;

  // Keep generating a new join code until a unique one is found
  do {
    joinCode = uuidv4().slice(0, 8); // Generate a random 8-character string
    const existingCommunity = await prisma.community.findUnique({
      where: { joinCode },
    });
    if (!existingCommunity) {
      isUnique = true; // It's unique
    }
  } while (!isUnique);

  return joinCode;
};

// Create a new community
export const create_community = async (req: Request, res: Response) => {
  try {
    if(!bodyParser(createCommunitySchema, req, res)) return;
    const { name, description, scope, userId }: createCommunityRequest = req.body;

    const existingCommunity = await prisma.community.findUnique({
      where: { name },
    });

    if (existingCommunity) {
      return responseCodes.clientError.badRequest(res, 'Community name must be unique');
    }

    // Generate a unique join code
    const joinCode = await generateUniqueJoinCode();

    // Create the community
    const newCommunity = await prisma.community.create({
      data: {
        name,
        description,
        scope: scope || 'PUBLIC', // Default to PUBLIC if not provided
        joinCode,
        members: {
          create: {
            userId,
            role: 'OWNER', 
          },
        },
      },
      include: {
        members: true, // Include members in the response
      },
    });

    const memberCount = newCommunity.members.length;
    
    const membersWithoutIds = newCommunity.members.map(({ id, communityId, ...rest }) => rest); // Exclude id and communityId
    
    const owner = newCommunity.members.find(member => member.role === 'OWNER');
    const ownerWithoutIds = {...owner, id:undefined, communityId: undefined};
    
    const responseData = {
      ...newCommunity,
      members: membersWithoutIds,
      memberCount, // Add memberCount to the response
      owner : ownerWithoutIds
    };

    return responseCodes.success.created(res, responseData, 'Community created successfully');
  } catch (error) {
    console.error('Error creating community:', error);
    return responseCodes.serverError.internalServerError(res, 'Internal server error');
  }
};
