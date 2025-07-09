import { Request, Response } from "express"
import { prisma } from "../../config/dbConnect";
import { responseCodes } from "../../utils/response-codes";

export const get_community_details = async (req: Request, res: Response) =>{
    try{
    const communityId = Number(req.params.communityId);

    const community = await prisma.community.findUnique({
        where:{
            id: communityId
        }
    })
    responseCodes.success.ok(res, community, "community details fetched");
    }
    catch(error){
        console.log("error getting community details",error);
        responseCodes.serverError.internalServerError(res, "internal server error");
    }
}