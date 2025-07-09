import { Response, Request, NextFunction } from "express";
import { responseCodes } from "../utils/response-codes";
import { prisma } from "../config/dbConnect";

export const isUserAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;

        let communityId:number = Number(req.body.communityId);
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
        if(!(isMember.role == "ADMIN" || isMember.role == "OWNER")){
            return responseCodes.clientError.forbidden(res, "You are not an admin of the community");
        }
        next();
    } catch (error) {
      console.log(error);
      return responseCodes.serverError.internalServerError(res, "An error occurred during authentication.");
    }
  };
  
