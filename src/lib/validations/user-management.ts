import { z } from 'zod';

export const createUserSchema = z
  .object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    email: z.string().email(),
    mobile: z.string().min(6).max(20),
    password: z.string().min(6),
    userRole: z.enum(['user', 'admin']).default('user'),
  })
  .strict();

export const updateUserSchema = z
  .object({
    firstName: z.string().min(2).max(100).optional(),
    lastName: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    mobile: z.string().min(6).max(20).optional(),
    phoneExt: z.string().max(10).optional(),

    // Profile fields
    bio: z.string().max(1000).optional(),
    dob: z.string().optional(), // ISO string
    gender: z.enum(['female', 'male', 'other']).optional(),
    userType: z.string().optional(),
    relationshipStatus: z.string().optional(),
    educationLevel: z.string().optional(),
    languages: z.array(z.string()).optional(),
    experienceHabits: z.string().optional(),
    drinkingHabits: z.string().optional(),
    smokingHabits: z.string().optional(),
    religious: z.string().optional(),
    political: z.string().optional(),
    havePets: z.string().optional(),
    haveChildren: z.string().optional(),
    wantChildren: z.string().optional(),
    height: z.coerce.number().optional(),

    adminRoleId: z.coerce.number().optional()
  })
  .strict();

export const getUsersFilterSchema = z.object({
  search: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

/* TS type from schema */
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type GetUsersFilterDTO = z.infer<typeof getUsersFilterSchema>;
