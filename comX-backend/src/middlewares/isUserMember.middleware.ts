import { Response, Request, NextFunction } from "express";
import { responseCodes } from "../utils/response-codes";
import { prisma } from "../config/dbConnect";

export const isUserMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;

        let communityId:number = req.body.communityId;
        if(!communityId){
            communityId = Number(req?.params?.communityId);
        }
        if(!communityId){
            return responseCodes.clientError.badRequest(res, "communityId not found");
        }

        const isMember = await prisma.communityMember.findUnique({
            where: {
              userId_communityId: {
                userId,
                communityId,
              },
            },
          });

        if(!isMember){
            return responseCodes.clientError.notFound(res, "You are not a part of the community");
        }
        if(isMember.role == "QUEUE"){
            return responseCodes.clientError.badRequest(res, "Your join request is pending");
        }
        next();
    } catch (error) {
      console.log(error);
      return responseCodes.serverError.internalServerError(res, "An error occurred during authentication.");
    }
  };
  
