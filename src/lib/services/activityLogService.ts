import { get } from "@/lib/api";
import type { GetActivityLogsFilterDTO } from "@/lib/validations/activity-log";

export interface AdminActivityLog {
  id: number;
  adminId: number;
  module: string;
  action: string;
  details: any;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
  admin?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/** GET /activity-logs - Returns admin activity logs. */
export async function getActivityLogs(
  params: GetActivityLogsFilterDTO
): Promise<AdminActivityLog[]> {
  return get<AdminActivityLog[]>("/activity-logs", { params });
}
