import { z } from "zod";

export const registerAgentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number starting with 6–9"),
  address: z.string().trim().max(200, "Address is too long").optional().or(z.literal("")),
  city: z.string().trim().max(60, "City name is too long").optional().or(z.literal("")),
  panCard: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(val),
      "Enter a valid PAN (e.g. ABCDE1234F)"
    ),
});

export type RegisterAgentDto = z.infer<typeof registerAgentSchema>;

export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const flattened = error.flatten();
  const next: Record<string, string> = {};
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    const msg = Array.isArray(messages) ? messages[0] : messages;
    if (typeof msg === "string") next[key] = msg;
  }
  return next;
}
