import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { create_token } from "../../utils/token";
import { responseCodes } from "../../utils/response-codes";
import { generateOTP, sendOtpEmail } from "./send-email-otp.controller";
import { prisma } from "../../config/dbConnect";
import bcryptjs from "bcryptjs";
import fs from "fs";
import { registerRequestSchema, registerRequest } from "@prathamjain522/comx-common";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import { bodyParser } from "../../utils/body-parser";

export const register = async (req: Request, res: Response) => {
    if(!bodyParser(registerRequestSchema, req, res)) return;
    const { name, username, email, password, designation}: registerRequest = req.body;

    if(!name || !username || !email || !password || !designation){
        responseCodes.clientError.notFound(res, "all fields are required");
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    try {

        let avatarUrl;
        if(req.file){
            const localFilePath = req.file.path;
            const cloudinaryResult = await uploadOnCloudinary(localFilePath);

            if(!cloudinaryResult){
                return responseCodes.serverError.internalServerError(res, "cloudinary upload failed");
            }
            
            avatarUrl = cloudinaryResult.url;
            fs.unlinkSync(localFilePath);
        }

        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                username: username,
                password: hashedPassword,
                designation: designation,
                avatar: avatarUrl
            }
        })
        await create_token(res, user);
        const otp = generateOTP();
        sendOtpEmail(user.email, otp, 'Email Verification OTP', `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`);
        user.password = "";
        return responseCodes.success.created(res, user, "User created successfully");
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const targetField = error.meta?.target as string[];

                if (targetField.includes('email')) {
                    return responseCodes.clientError.badRequest(res, "Email already exists");
                }

                if (targetField.includes('username')) {
                    return responseCodes.clientError.badRequest(res, "Username already exists");
                }
            }
        }
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
}
