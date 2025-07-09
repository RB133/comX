import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const get_calendar_task = async(req:Request, res: Response) => {
    try{
        const communityId = Number(req.params.communityId);

        const tasks = await prisma.communityCalendar.findMany({
            where:{
                communityId: communityId
            },
            select:{
                id: true,
                title: true,
                description: true,
                startTime: true,
                endTime: true,
                color: true
            }
        })
        return responseCodes.success.created(res, tasks, "get Tasks");
    }
    catch(error){
        console.log("get calendar task error", error);
        return responseCodes.serverError.internalServerError(res, "internal server error");
    }
}