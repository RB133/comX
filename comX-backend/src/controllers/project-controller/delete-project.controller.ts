import { Request, Response } from "express"
import { responseCodes } from "../../utils/response-codes"
import { prisma } from "../../config/dbConnect";
export const delete_project = async(req: Request, res: Response) =>{
    try{
        const {projectId} = req.body;
        await prisma.project.delete({
            where:{
                id: projectId
            }
        });
        return responseCodes.success.ok(res, "deleted successfully");
    }
    catch(e){
        console.log(e);
        responseCodes.serverError.internalServerError(res, "internal error occured");
    }
}