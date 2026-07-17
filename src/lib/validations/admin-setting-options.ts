import { z } from "zod";

export const SETTING_OPTION_CATEGORIES = [
  "gender",
  "user_type",
  "relationship_status",
  "education_level",
  "yes_no_prefer",
  "connection_type",
  "experience_habits",
  "drinking_habits",
  "smoking_habits",
  "religion",
  "politics",
  "language",
] as const;

export type SettingOptionCategory = (typeof SETTING_OPTION_CATEGORIES)[number];

export const settingOptionCategorySchema = z.enum(SETTING_OPTION_CATEGORIES);

export const createSettingOptionSchema = z.object({
  name: z.string().trim().min(1).max(255),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateSettingOptionSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const reorderSettingOptionsSchema = z.object({
  orderedIds: z.array(z.number().int().positive()).min(1),
});

export const listSettingOptionsQuerySchema = z.object({
  includeInactive: z.coerce.boolean().optional(),
});

export type CreateSettingOptionDto = z.infer<typeof createSettingOptionSchema>;
export type UpdateSettingOptionDto = z.infer<typeof updateSettingOptionSchema>;
export type ReorderSettingOptionsDto = z.infer<typeof reorderSettingOptionsSchema>;
export type ListSettingOptionsQueryDto = z.infer<
  typeof listSettingOptionsQuerySchema
>;
