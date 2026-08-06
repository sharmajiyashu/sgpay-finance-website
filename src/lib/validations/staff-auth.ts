import { z } from "zod";

export const staffForgotPasswordSchema = z.object({
  email: z.string().email("Valid email required"),
});

export const staffResetPasswordSchema = z.object({
  email: z.string().email("Valid email required"),
  otp: z
    .string()
    .length(4, "Code must be 4 digits")
    .regex(/^\d+$/, "Code must contain only digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type StaffForgotPasswordDto = z.infer<typeof staffForgotPasswordSchema>;
export type StaffResetPasswordDto = z.infer<typeof staffResetPasswordSchema>;
export type ChangePasswordFormDto = z.infer<typeof changePasswordFormSchema>;
