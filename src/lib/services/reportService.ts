import {
  get,
  patch,
} from "@/lib/api";
import type {
  UpdateReportStatusDto,
} from "@/lib/validations/report";

export interface Report {
  id: number;
  reporterId: number;
  reportedUserId?: number;
  conversationId?: number;
  messageId?: number;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  reporter?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  reportedUser?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  message?: string;
}

export interface SuspiciousAccount {
  userId: number;
  reportCount: number;
}

export interface ReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** GET /reports - Returns list of user reports. */
export async function getReports(params: {
  status?: 'pending' | 'resolved' | 'dismissed';
  page?: number;
  limit?: number;
}): Promise<Report[]> {
  const data = await get<Report[]>("/reports", { params });
  return Array.isArray(data) ? data : [];
}

/** PATCH /reports/:id - Updates report status and admin notes. */
export async function updateReportStatus(
  id: number,
  body: UpdateReportStatusDto
): Promise<Report[]> {
  return patch<Report[]>(`/reports/${id}`, body);
}

/** GET /suspicious-accounts - Returns list of accounts with high report counts. */
export async function getSuspiciousAccounts(): Promise<SuspiciousAccount[]> {
  const data = await get<SuspiciousAccount[]>("/suspicious-accounts");
  return Array.isArray(data) ? data : [];
}
