import { z } from 'zod';

export const createReportSchema = z.object({
    reportedUserId: z.coerce.number().int().optional(),
    conversationId: z.coerce.number().int().optional(),
    messageId: z.coerce.number().int().optional(),
    reason: z.string().min(5, "Reason must be at least 5 characters long"),
}).refine(data => data.reportedUserId || data.conversationId || data.messageId, {
    message: "At least one of reportedUserId, conversationId, or messageId must be provided"
});

export const updateReportStatusSchema = z.object({
    status: z.enum(['pending', 'resolved', 'dismissed']),
    adminNote: z.string().optional()
});

export type CreateReportDto = z.infer<typeof createReportSchema>;
export type UpdateReportStatusDto = z.infer<typeof updateReportStatusSchema>;
