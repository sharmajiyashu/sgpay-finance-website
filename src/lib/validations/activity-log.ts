import { z } from 'zod';

export const getActivityLogsFilterSchema = z.object({
  adminId: z.coerce.number().optional(),
  module: z.string().optional(),
  action: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export type GetActivityLogsFilterDTO = z.infer<typeof getActivityLogsFilterSchema>;
