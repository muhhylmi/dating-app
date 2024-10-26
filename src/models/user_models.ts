import { z } from 'zod';

const dateSchema = z.string().regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
  message: "Date must be in the format dd/mm/yyyy",
});
export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is invalid"),
  password: z.string().min(5, "Password must be at least 6 characters long"),
  gender: z.enum(["male", "female"]),
  birthDate: dateSchema
});
export const loginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(5, "Password must be at least 6 characters long"),
});

export type UserModel = {
    id?: number;
    email: string;
    name: string;
    password?: string;
    gender: string;
    birthDate: string;
};
export type UserResponse = UserModel | null;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

