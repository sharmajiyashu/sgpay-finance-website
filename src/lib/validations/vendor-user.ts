import { z } from "zod";

/** Password: min 8 chars, one upper, one lower, one number, one special. */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

/** Optional locale object { en, kh } with min/max length. */
const localeSchema = z.object({
  en: z.string().min(1).max(50),
  kh: z.string().min(1).max(50),
});

const optionalLocaleSchema = z
  .object({
    en: z.string().optional(),
    kh: z.string().optional(),
  })
  .optional();

// ----- Login -----
export const loginVendorUserSchema = z.object({
  phoneExt: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, "Password is required"),
  clinicCode: z.string().min(1, "Clinic code is required"),
});

export type LoginVendorUserDto = z.infer<typeof loginVendorUserSchema>;

// ----- Create -----
export const createVendorUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: passwordSchema,
  vendorRoleId: z.coerce.number(),
  clinicId: z.coerce.number(),
  phoneExt: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  dob: z.string().optional(),
  language: z.string().optional(),
  country: localeSchema.optional(),
  city: localeSchema.optional(),
  state: localeSchema.optional(),
  zipCode: z.string().optional(),
  deviceType: z.enum(["web"]).default("web"),
  userType: z.enum(["vendor"]).default("vendor"),
});

export type CreateVendorUserDto = z.infer<typeof createVendorUserSchema>;

// ----- Update -----
export const updateVendorUserSchema = z.object({
  clinicId: z.coerce.number(),
  userId: z.coerce.number(),
  name: z.string().optional(),
  email: z.email().optional(),
  password: passwordSchema.optional(),
  vendorRoleId: z.coerce.number().optional(),
  phoneExt: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  dob: z.string().optional(),
  language: z.string().optional(),
  country: optionalLocaleSchema,
  city: optionalLocaleSchema,
  state: optionalLocaleSchema,
  zipCode: z.string().optional(),
  deviceType: z.enum(["web"]).optional(),
  isActive: z.coerce.boolean().optional(),
});

export type UpdateVendorUserDto = z.infer<typeof updateVendorUserSchema>;

// ----- Get (POST /user/get body) -----
export const getVendorUserSchema = z.object({
  clinicId: z.coerce.number(),
  userId: z.coerce.number().optional(),
  email: z.coerce.string().optional(),
  phoneExt: z.coerce.string().optional(),
  phone: z.coerce.string().optional(),
  name: z.coerce.string().optional(),
  vendorRoleId: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type GetVendorUserDto = z.infer<typeof getVendorUserSchema>;

// ----- Delete (id in URL params) -----
export const deleteVendorUserSchema = z.object({
  id: z.coerce.number(),
});

export type DeleteVendorUserDto = z.infer<typeof deleteVendorUserSchema>;
