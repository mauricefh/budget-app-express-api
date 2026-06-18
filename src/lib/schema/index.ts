import * as z from "zod";

export const registerSchema = z.object({
  email: z.email("Email is not in a valid format").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be greater than 8 characters")
    .max(72, "Password must be smaller then 72 characters"),
});

export const loginSchema = z.object({
  email: z.email("Email is not in a valid format").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});
