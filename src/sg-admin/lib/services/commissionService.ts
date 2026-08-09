import { get, patch, put } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";

export interface CommissionRule {
  _id: string;
  productType: string;
  level: string;
  percent: number;
  isActive: boolean;
}

export interface CommissionLedgerRow {
  _id: string;
  productType: string;
  amountBase: number;
  percent: number;
  commissionAmount: number;
  level?: string;
  status: "pending" | "approved" | "paid";
  beneficiaryUserId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    designation?: string;
    agentType?: string;
  };
  fromUserId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    agentType?: string;
  };
  leadId?: {
    productType?: string;
    status?: string;
    customerName?: string;
    createdAt?: string;
  };
  createdAt?: string;
}

export async function getCommissionRules(productType = "credit-card") {
  return get<{ rules: CommissionRule[]; productType: string }>(
    `${ADMIN_API_PATHS.commissionRules}?productType=${encodeURIComponent(productType)}`
  );
}

export async function saveCommissionRules(
  rules: Array<{ level: string; percent: number; isActive?: boolean }>,
  productType = "credit-card"
) {
  return put<{ rules: CommissionRule[] }>(ADMIN_API_PATHS.commissionRules, {
    productType,
    rules,
  });
}

export async function getCommissionLedger(url: string) {
  return get<{
    ledger: CommissionLedgerRow[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(url);
}

export async function updateLedgerStatus(
  id: string,
  status: "pending" | "approved" | "paid"
) {
  return patch<CommissionLedgerRow>(ADMIN_API_PATHS.commissionLedgerStatus(id), { status });
}
