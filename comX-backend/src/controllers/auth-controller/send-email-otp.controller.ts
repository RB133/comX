import nodemailer from 'nodemailer';
import { Request, Response } from "express";
import { responseCodes } from '../../utils/response-codes';
import { prisma } from '../../config/dbConnect';
import { sendEmailOtpRequest, sendEmailOtpRequestSchema } from '../../schemas/auth.schema';
import { bodyParser } from '../../utils/body-parser';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(toEmail: string, otp: string, subject: string, text: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `comX <${process.env.EMAIL}>`,
      to: toEmail,
      subject: subject,
      text: text,
    };

    await prisma.user.update({
      where: {
        email: toEmail,
      },
      data: {
        isVerified: false,
        otp: otp,
        isOtpValid: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

export const send_email_otp = async (req: Request, res: Response) => {
  try {
    if(!bodyParser(sendEmailOtpRequestSchema, req, res)) return;
    const { email }: sendEmailOtpRequest = req.body;
    const otp = generateOTP();
    await sendOtpEmail(email, otp, 'Email Verification OTP', `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`).then(() => console.log('OTP sent!'));
    responseCodes.success.ok(res, {}, "otp sent");
  }
  catch (error) {
    console.log(error);
    responseCodes.serverError.internalServerError(res, "internal error");
  }
}
