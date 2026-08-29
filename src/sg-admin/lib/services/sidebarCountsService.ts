import { useQuery } from "@tanstack/react-query";
import { get } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type { SidebarBadgeKey } from "@/sg-admin/lib/sidebar-nav";

export interface SidebarCounts {
  pendingEnquiries: number;
  pendingAgents: number;
  roarPending: number;
  pendingWithdrawals?: number;
}

export async function getSidebarCounts(): Promise<SidebarCounts> {
  return get<SidebarCounts>(ADMIN_API_PATHS.sidebarCounts);
}

export function useSidebarCounts() {
  return useQuery({
    queryKey: ["sidebar-counts"],
    queryFn: getSidebarCounts,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function readSidebarBadge(
  counts: SidebarCounts | undefined,
  key?: SidebarBadgeKey
): number {
  if (!counts || !key) return 0;
  return counts[key] ?? 0;
}
