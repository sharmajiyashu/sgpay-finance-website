import { z } from "zod";

export const updateEnquiryStatusSchema = z.object({
    status: z.enum([
        "pending",
        "in_progress",
        "resolved",
        "closed"
    ])
});

export const getEnquiriesFilterSchema = z.object({
    search: z.string().optional(),
    type: z.enum([
        "general",
        "technical_support",
        "billing",
        "complaint",
        "feedback",
        "other"
    ]).optional(),
    status: z.enum([
        "pending",
        "in_progress",
        "resolved",
        "closed"
    ]).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
});

export type UpdateEnquiryStatusDto = z.infer<typeof updateEnquiryStatusSchema>;
export type GetEnquiriesFilterDto = z.infer<typeof getEnquiriesFilterSchema>;
