import { NextFunction, Request, response, Response } from "express";
import { prisma } from "../config/dbConnect";
import { responseCodes } from "../utils/response-codes";

export const isUserInProject = async(req: Request, res:Response, next: NextFunction) => {
    try{

        const {userId} = req.body;
        let communityId:number = req.body.communityId;
        if(!communityId){
            communityId = Number(req?.params?.communityId);
        }
        if(!communityId){
            return responseCodes.clientError.badRequest(res, "communityId not found");
        }
        let projectId:number = req.body.projectId;
        if(!projectId){
            projectId = Number(req?.params?.projectId);
        }
        if(!projectId){
            return responseCodes.clientError.badRequest(res, "project not found");
        }

        if(!projectId || !userId || !communityId){
            return responseCodes.clientError.badRequest(res, "not found some field");
        }
        const verdict = await prisma.projectMembers.findFirst({
            select:{
                id: true
            },
            where:{
                projectId: projectId,
                communityId: communityId,
                userId: userId
            }
        })
        if(verdict){
            next();
        }
        else{
            return responseCodes.clientError.forbidden(res, "Not a member of the project");
        }
    }
    catch(e){
        console.log(e);
        return responseCodes.serverError.internalServerError(res, "server error");
    }
}