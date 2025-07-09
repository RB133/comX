import { Request, Response } from "express";
import { create_token } from "../../utils/token";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";
import bcryptjs from "bcryptjs";
import { loginRequest, loginRequestSchema } from "@prathamjain522/comx-common";
import { bodyParser } from "../../utils/body-parser";

export const login = async (req: Request, res: Response) => {
    if(!bodyParser(loginRequestSchema, req, res)) return;
    const { emailOrUsername, password }:loginRequest = req.body;
    if (!password || !emailOrUsername) {
        return responseCodes.clientError.notFound(res, "All fields are required");
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername},
                    { username: emailOrUsername }
                ]
            },
        });
        if(!user){
            return responseCodes.clientError.notFound(res, "User not found");
        }
    
        const match = await bcryptjs.compare(password, user.password);
        if(!match){
            return responseCodes.clientError.forbidden(res, "wrong email or password");
        }

        await create_token(res, user);
        user.password = "";
        return responseCodes.success.ok(res, user, "Logged in successfully");
    }
    catch(error){
        console.log(error);
        return responseCodes.serverError.internalServerError(res, "Internal Error");
    }
};