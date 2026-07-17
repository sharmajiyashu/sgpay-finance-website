import { get } from "@/lib/api";

export interface StatItem {
  value: number;
  label: string;
  comparison?: number;
  lastMonthValue?: number;
  lastMonthNewValue?: number;
  newThisMonth?: number;
}

export interface DashboardStats {
  totalUsers: StatItem;
  newRegistrations: StatItem;
  activeUsers: StatItem;
  subscriptions: StatItem;
}

/** GET /dashboard/stats - Returns dashboard statistics. */
export async function getDashboardStats(): Promise<DashboardStats> {
  return get<DashboardStats>("/dashboard/stats");
}
