import { get } from "@/sg-agent/lib/api";
import { AGENT_API_PATHS } from "@/lib/config/env";

export interface AgentCommissionRow {
  _id: string;
  productType: string;
  amountBase: number;
  percent: number;
  commissionAmount: number;
  level?: string;
  status: string;
  fromUserId?: { firstName?: string; lastName?: string; email?: string };
  leadId?: { customerName?: string; status?: string; createdAt?: string };
  createdAt?: string;
}

export async function getMyCommissions(url?: string) {
  return get<{
    ledger: AgentCommissionRow[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(url || AGENT_API_PATHS.commissions);
}
