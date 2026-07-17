import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("Invalid email format"),
  password: z.string().min(1, { message: "Password is required" }),
});

export type AdminLoginDto = z.infer<typeof adminLoginSchema>;

