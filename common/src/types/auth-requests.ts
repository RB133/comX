import { z } from 'zod';

export const registerRequestSchema = z.object({
  username: z.string(),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  designation: z.string(),
  name: z.string()
});

export type registerRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type loginRequest = z.infer<typeof loginRequestSchema>;

export const sendEmailOtpRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
})

export type sendEmailOtpRequest = z.infer<typeof sendEmailOtpRequestSchema>;

export const sendForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
})

export type sendForgotPasswordRequest = z.infer<typeof sendForgotPasswordSchema>;

export const verifyEmailOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "Not valid otp format must be 6 digit number"),
})

export type verifyEmailOtpRequest = z.infer<typeof verifyEmailOtpSchema>;

export const verifyForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "Not valid otp format must be 6 digit number"),
})

export type verifyForgotPasswordRequest = z.infer<typeof verifyForgotPasswordSchema>;

export const changePasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type changePasswordRequest = z.infer<typeof changePasswordSchema>;
