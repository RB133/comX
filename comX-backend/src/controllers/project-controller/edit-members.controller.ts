import { Request, Response } from "express"
import { responseCodes } from "../../utils/response-codes"
import { prisma } from "../../config/dbConnect";
export const edit_members = async(req: Request, res: Response) =>{
    try{
        const {projectId, communityId, add, remove} = req.body;
        const addMembers = [
            ...add.map((memberId: number) => ({
                communityId: communityId,
                projectId: projectId,
                userId: memberId,
            })),
        ]

        await prisma.projectMembers.createMany({
            data: addMembers,
            skipDuplicates: true
        })

        await prisma.projectMembers.deleteMany({
            where: {
                projectId: projectId,
                communityId: communityId,
                userId: {
                    in: remove,  // filter with an array of user IDs
                },
            },
        });

        return responseCodes.success.ok(res, "user added and removed to the project");
    }
    catch(e){
        console.log(e);
        return responseCodes.serverError.internalServerError(res, "internal error occured");
    }
    
}