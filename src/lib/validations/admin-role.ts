import z from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const createAdminUserRoleSchema = z.object({
  name: z.string(),
  description: z.string(),
  permissions: z.array(
    z.object({
      moduleName: z.string(),
      enabled: z.boolean(),
      features: z.record(
        z.string(),
        z.object({
          enabled: z.boolean(),
          description: z.union([
            z.string(),
            z.object({
              en: z.string(),
              kh: z.string()
            })
          ]),
        })
      )
    })
  )
});

export const updateAdminUserRoleSchema = z.object({
  adminRoleId: z.coerce.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  permissions: z
    .array(
      z.object({
        moduleName: z.string(),
        enabled: z.coerce.boolean(),
        features: z.record(
          z.string(),
          z.object({
            enabled: z.coerce.boolean(),
            description: z.union([
              z.string(),
              z.object({
                en: z.string(),
                kh: z.string()
              })
            ]),
          })
        )
      })
    )
    .optional()
});

export const deleteAdminUserRoleSchema = z.object({
  adminRoleId: z.coerce.number()
});

export const getAdminUserRoleByIdSchema = z.object({
  adminRoleId: z.coerce.number().optional()
});

export type CreateAdminUserRoleDto = z.infer<typeof createAdminUserRoleSchema>;
export type UpdateAdminUserRoleDto = z.infer<typeof updateAdminUserRoleSchema>;
export type DeleteAdminUserRoleDto = z.infer<typeof deleteAdminUserRoleSchema>;
export type GetAdminUserRoleByIdDto = z.infer<typeof getAdminUserRoleByIdSchema>;

export const createAdminUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  mobile: z.string().optional(),
  phoneExt: z.string().optional(),
  password: passwordSchema,
  roleId: z.coerce.number(),
  role: z.enum(["admin"]).default("admin"),
  isActive: z.coerce.boolean().default(true),
});

export const updateAdminUserSchema = z.object({
  id: z.coerce.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  password: passwordSchema.optional(),
  roleId: z.coerce.number().optional(),
  phoneExt: z.string().optional(),
  mobile: z.string().optional(),
  profileImage: z.string().optional(),
  dob: z.string().optional(),
  language: z.string().optional(),
  country: z
    .object({
      en: z.string().min(1).max(50),
      kh: z.string().min(1).max(50)
    })
    .optional(),
  city: z
    .object({
      en: z.string().min(1).max(50),
      kh: z.string().min(1).max(50)
    })
    .optional(),
  state: z
    .object({
      en: z.string().min(1).max(50),
      kh: z.string().min(1).max(50)
    })
    .optional(),
  zipCode: z.string().optional(),
  deviceType: z.enum(['web']).optional(),
  userType: z.enum(['admin']).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const deleteAdminUserSchema = z.object({
  id: z.coerce.number()
});

export const getAdminUserByIdSchema = z.object({
  userId: z.coerce.number().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  roleId: z.coerce.number().optional(),
  page: z.preprocess((val) => Number(val), z.number().int().min(1).default(1)),
  limit: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1).max(100).default(10)
  ),
});

export type CreateAdminUserDto = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserDto = z.infer<typeof updateAdminUserSchema>;
export type DeleteAdminUserDto = z.infer<typeof deleteAdminUserSchema>;
export type GetAdminUserByIdDto = z.infer<typeof getAdminUserByIdSchema>;

export const loginAdminUserSchema = z.object({
  email: z.string().optional(),
  mobile: z.string().optional(),
  phoneExt: z.string().optional(),
  password: z.string()
}).refine(data => data.email || (data.mobile && data.phoneExt), {
  message: "Either email or (mobile and phoneExt) must be provided",
  path: ["email"]
});

export type LoginAdminUserDto = z.infer<typeof loginAdminUserSchema>;
