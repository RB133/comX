import { Request, response, Response } from "express";
import { isUserMember } from "../../utils/is-user-member";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const accept_join_request = async (req: Request, res: Response) => {
    try{
        const {communityId} = req.body;
        let memberId: number = req.body.memberId;
        if(!memberId){
            return responseCodes.clientError.badRequest(res, "no memberId recieved");
        }
        
        const member = await isUserMember(memberId, communityId);
        
        if(!member || member.role !== 'QUEUE'){
            return responseCodes.clientError.forbidden(res, 'The person you are trying to accept is not in queue');
        }

        const updatedMember = await prisma.communityMember.update({
            where: {
              userId_communityId: {
                userId: memberId,
                communityId: communityId
              },
            },
            data: {
              role: 'MEMBER',
              joinedAt: new Date()
            },
        });

        return responseCodes.success.ok(res, updatedMember, "user is now a member");

    }
    catch(error){
        return responseCodes.serverError.internalServerError(res, "internal server error");
    }
}