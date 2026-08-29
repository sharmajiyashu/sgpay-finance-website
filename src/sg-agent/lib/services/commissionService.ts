import { get, post } from "@/sg-agent/lib/api";
import { AGENT_API_PATHS } from "@/lib/config/env";
import type {
  CommissionTransaction,
  CommissionWallet,
  CommissionWithdrawal,
  WithdrawalRequestInput,
} from "@/sg-admin/lib/services/commissionService";

export interface AgentCommissionSummary {
  count: number;
  totalAmount: number;
  pendingAmount: number;
  approvedAmount: number;
  paidAmount: number;
}

export interface AgentCommissionRow {
  _id: string;
  productType: string;
  source?: "choice-connect" | "roar";
  amountBase: number;
  percent: number;
  commissionAmount: number;
  level?: string;
  status: string;
  fromUserId?: { firstName?: string; lastName?: string; email?: string };
  leadId?: { _id?: string; customerName?: string; status?: string; createdAt?: string; productType?: string };
  enquiryId?: { _id?: string; name?: string; status?: string; createdAt?: string };
  createdAt?: string;
}

export async function getMyCommissions(url?: string) {
  return get<{
    ledger: AgentCommissionRow[];
    summary?: AgentCommissionSummary;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(url || AGENT_API_PATHS.commissions);
}

export async function getAgentWallet() {
  return get<CommissionWallet>(AGENT_API_PATHS.commissionWallet);
}

export async function getAgentTransactions(page = 1) {
  return get<{
    transactions: CommissionTransaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`${AGENT_API_PATHS.commissionTransactions}?page=${page}&limit=20`);
}

export async function getAgentWithdrawals(page = 1) {
  return get<{
    withdrawals: CommissionWithdrawal[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`${AGENT_API_PATHS.commissionWithdrawals}?page=${page}&limit=20`);
}

export async function requestAgentWithdrawal(input: WithdrawalRequestInput) {
  return post<CommissionWithdrawal>(AGENT_API_PATHS.commissionWithdrawals, input);
}
