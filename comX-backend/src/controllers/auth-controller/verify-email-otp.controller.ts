import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";
import { verifyEmailOtpRequest, verifyEmailOtpSchema } from "@prathamjain522/comx-common";
import { bodyParser } from "../../utils/body-parser";

export const verify_email_otp = async(req: Request, res: Response) => {
    if(!bodyParser(verifyEmailOtpSchema, req, res)) return;
    const {email, otp}:verifyEmailOtpRequest = req.body;
    
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    });
    if(!user){
        return responseCodes.clientError.notFound(res, "user not found with this email");
    }
    const currentTime = new Date();
    if (user.otp !== otp || user.isOtpValid === null || currentTime > user.isOtpValid) {
        
        return responseCodes.clientError.badRequest(res, "Invalid or expired OTP");
    }

    await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          isVerified: true,
          otp: null,             
          isOtpValid: null,       
        },
      });
  
      return responseCodes.success.ok(res, "Email verified successfully");
}