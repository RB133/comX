import { Request, Response } from "express";
import { isUserMember } from "../../utils/is-user-member";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const demote_member = async (req: Request, res: Response) => {
    try{
        const {communityId, demoting_id} = req.body;
        
        const member = await isUserMember(demoting_id, communityId);
        
        if(!member){
            return responseCodes.clientError.forbidden(res, 'The person you are trying to promote is not a member of this community');
        }
        
        if (member.role !== 'ADMIN') {
            return responseCodes.clientError.forbidden(res, 'The person you are trying to promote is not an admin');
        }

        const updatedMember = await prisma.communityMember.update({
            where: {
              userId_communityId: {
                userId: demoting_id,
                communityId: communityId
              },
            },
            data: {
              role: 'MEMBER',
            },
        });

        return responseCodes.success.ok(res, updatedMember, "user is demoted");

    }
    catch(error){
        return responseCodes.serverError.internalServerError(res, "internal server error");
    }
}