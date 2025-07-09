import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";
import { Status } from "@prisma/client";

export const complete_task = async (req: Request, res: Response) => {
    try {
        const {taskId, userId} = req.body;
        
        const data = await prisma.task.findFirst({
            where:{
                id: taskId,
                assignId: userId
            }
        })
        if(!data){
            return responseCodes.clientError.badRequest(res, "You are not assigned this task");
        }

        let q: Status;
        let completedDate: Date | null;
        if(data.status == "INPROGRESS"){
            q = "PENDING";
            completedDate = new Date();
        }
        else if(data.status == "PENDING"){
            q = "INPROGRESS";
            completedDate = null;
        }
        else{
            return responseCodes.clientError.badRequest(res, "task already completed");
        }
        
        await prisma.task.update({
            data:{
                status: q,
                completedDate: completedDate
            },
            where:{
                id: taskId,
                assignId: userId
            }
        })

        return responseCodes.success.ok(res, `Task ${q}`);
    } catch (error) {
        console.error(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
};
