import { Request, Response } from "express";
import { prisma } from "../../config/dbConnect";
import { responseCodes } from "../../utils/response-codes";

export const get_all_projects = async (req:Request, res:Response) => {
    try{
        const {userId} = req.body;
        const communityId:number = Number(req.params.communityId);

        if(!communityId){
            return responseCodes.clientError.badRequest(res, "no communityId found");
        }

        const projects = await prisma.projectMembers.findMany({
            where: {
                userId: userId,
                communityId: communityId
            },
            include:{
                project: true
            }
        })

        const data = projects.map((item)=> item.project);

        return responseCodes.success.ok(res, data, "all projects fetched");
    }
    catch(e){
        console.log(e);
        return responseCodes.serverError.internalServerError(res, "internal server error");
    }
}