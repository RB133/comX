export type User = {
    name: string;
    email: string;
    username: string;
    id: number;
    designation: string;
    isVerified: Boolean | null;
    otp?: string | null;
    isOtpValid?: Date | null; 
    password?: string | null;
};