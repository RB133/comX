import { Request, response, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";

export const set_calendar_task = async(req:Request, res: Response) => {
    try{
        const {communityId, userId, startTime, endTime, title, description, color} = req.body;
        if(!communityId){
            return responseCodes.clientError.notFound(res, "communityId not found");
        }
        if(!startTime || !endTime || !title || !description || !color){
            return responseCodes.clientError.badRequest(res, "all fields are required");
        }

        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return responseCodes.clientError.badRequest(res, "Invalid date format");
        }

        // Ensure that startTime is less than endTime
        if (start >= end) {
        return responseCodes.clientError.badRequest(res, "Start time must be earlier than end time");
        }

        // Ensure that startTime is in the future
        if (start <= now) {
        return responseCodes.clientError.badRequest(res, "Start time must be in the future");
        }

        // Create the calendar task in the database
        const task = await prisma.communityCalendar.create({
        data: {
            userId: userId,
            communityId: communityId,
            title: title,
            description: description,
            startTime: start,
            endTime: end,
            color: color
        },
        });

        return responseCodes.success.created(res, task, "Task created");
    }
    catch(error){
        console.log("create calendar task error", error);
        return responseCodes.serverError.internalServerError(res, "internal server error");
    }
}