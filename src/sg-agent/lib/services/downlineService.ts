import { get, post } from "@/sg-agent/lib/api";
import { AGENT_API_PATHS } from "@/lib/config/env";

export interface DownlineAgent {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  city?: string;
  agentType?: "super_distributor" | "distributor" | "retailer";
  status?: string;
  isActive?: boolean;
  commissionPercent?: number | null;
  createdAt?: string;
}

export async function getDownline(url?: string) {
  return get<{
    agents: DownlineAgent[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    canCreate: string[];
  }>(url || AGENT_API_PATHS.downline);
}

export async function createDownlineAgent(body: {
  fullName: string;
  email: string;
  mobile: string;
  address?: string;
  city?: string;
  panCard?: string;
  agentType?: "distributor" | "retailer";
  commissionPercent?: number | null;
}) {
  return post<DownlineAgent>(AGENT_API_PATHS.downline, body);
}
