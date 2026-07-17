import { z } from "zod";

const permissionFeatureSchema = z.object({
  enabled: z.coerce.boolean(),
  description: z.object({ en: z.string(), kh: z.string() }),
});

const permissionModuleSchema = z.object({
  moduleName: z.string(),
  enabled: z.coerce.boolean(),
  features: z.record(z.string(), permissionFeatureSchema),
});

export const createVendorRoleSchema = z.object({
  name: z.string(),
  description: z.string(),
  clinicId: z.coerce.number(),
  permissions: z.array(permissionModuleSchema),
});

export const updateVendorRoleSchema = z.object({
  roleId: z.coerce.number(),
  clinicId: z.coerce.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(permissionModuleSchema).optional(),
});

export const deleteVendorRoleSchema = z.object({
  roleId: z.coerce.number(),
  clinicId: z.coerce.number(),
});

export const getVendorRolesSchema = z.object({
  clinicId: z.coerce.number(),
  roleId: z.coerce.number().optional(),
});

export type CreateVendorRoleDto = z.infer<typeof createVendorRoleSchema>;
export type UpdateVendorRoleDto = z.infer<typeof updateVendorRoleSchema>;
export type DeleteVendorRoleDto = z.infer<typeof deleteVendorRoleSchema>;
export type GetVendorRolesDto = z.infer<typeof getVendorRolesSchema>;
