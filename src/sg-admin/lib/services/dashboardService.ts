import { get } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type { Enquiry } from "@/sg-admin/lib/types/enquiry";
import type { PaginationMeta } from "@/sg-admin/lib/paginated-list";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalEnquiries: number;
  pendingAgents?: number;
  totalAgents?: number;
  enquiriesByStatus: {
    pending: number;
    in_progress: number;
    resolved: number;
  };
  recentEnquiries: Enquiry[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return get<DashboardStats>(ADMIN_API_PATHS.dashboardStats);
}
