import { z } from "zod";
import { Role } from "@/lib/roles";

export type Designation = {
  value: string;
  label: string;
};

// Define the Zod schema
export const UserDataSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    designation: z.any(),
    file:z.any(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserData = z.infer<typeof UserDataSchema>;

export type LoginDetails = {
  name: string;
  username: string;
  email: string;
  designation: string;
  isLoggedIn: boolean;
  id: number;
  avatar: string;
};

export type Member = {
  id: number;
  name: string;
  username: string;
  designation: string;
  email: string;
  role: Role;
  joinedAt: string;
  avatar: string;
};

export type PublicProfile = {
  name: string;
  email: string;
  username: string;
  avatar: string;
  designation: string;
  registeredAt: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  phone: string | null;
  skills: string[];
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    codechef?: string;
    codeforces?: string;
  };
  followers: Array<{
    name: string;
    username: string;
    avatar: string;
  }>;
  following: Array<{
    name: string;
    username: string;
    avatar: string;
  }>;
  Task: Array<{
    id: number;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status: "COMPLETED" | "PENDING" | "INPROGRESS";
    deadline: string;
    completedDate: string | null;
    createdAt: string;
  }>;
  projects: Array<{
    project: {
      id: number;
      name: string;
      description: string;
      deadline: string;
      createdAt: string;
    };
  }>;
};
