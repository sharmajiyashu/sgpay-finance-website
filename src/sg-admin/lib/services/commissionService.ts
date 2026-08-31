import { get, patch, post, put } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";

export type CommissionPayoutType = "percent" | "flat";

export interface CommissionRule {
  _id?: string;
  productType: string;
  level: string;
  payoutType?: CommissionPayoutType;
  percent: number;
  flatAmount?: number;
  isActive: boolean;
}

export interface CommissionRuleInput {
  level: string;
  payoutType: CommissionPayoutType;
  percent: number;
  flatAmount: number;
  isActive?: boolean;
}

export interface CommissionLedgerSummary {
  count: number;
  totalAmount: number;
  pendingAmount: number;
  approvedAmount: number;
  paidAmount: number;
}

export interface CommissionLedgerRow {
  _id: string;
  productType: string;
  source?: "choice-connect" | "roar";
  amountBase: number;
  payoutType?: CommissionPayoutType;
  percent: number;
  flatAmount?: number;
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
    _id?: string;
    productType?: string;
    status?: string;
    customerName?: string;
    createdAt?: string;
  };
  enquiryId?: {
    _id?: string;
    name?: string;
    status?: string;
    service?: string;
    createdAt?: string;
  };
  createdAt?: string;
}

export interface CommissionProductRate {
  productType: "credit-card" | "roar" | "motor-insurance" | string;
  label: string;
  payoutType: CommissionPayoutType;
  percent: number;
  flatAmount: number;
  isActive: boolean;
  source: "override" | "rule" | "none";
}

export interface CommissionRatesResponse {
  userId: string;
  roleKey?: string | null;
  roleLabel: string;
  products: CommissionProductRate[];
}

export async function getCommissionRates(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return get<CommissionRatesResponse>(`${ADMIN_API_PATHS.commissionRates}${query}`);
}

export async function getCommissionRules(productType = "credit-card") {
  return get<{ rules: CommissionRule[]; productType: string }>(
    `${ADMIN_API_PATHS.commissionRules}?productType=${encodeURIComponent(productType)}`
  );
}

export async function saveCommissionRules(
  rules: CommissionRuleInput[],
  productType = "credit-card"
) {
  return put<{ rules: CommissionRule[] }>(ADMIN_API_PATHS.commissionRules, {
    productType,
    rules: rules.map((rule) => ({
      level: rule.level,
      isActive: rule.isActive !== false,
      payoutType: rule.payoutType,
      percent: rule.payoutType === "percent" ? Number(rule.percent) || 0 : 0,
      flatAmount: rule.payoutType === "flat" ? Number(rule.flatAmount) || 0 : 0,
    })),
  });
}

export async function getCommissionLedger(url: string) {
  return get<{
    ledger: CommissionLedgerRow[];
    summary?: CommissionLedgerSummary;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(url);
}

export async function syncChoiceLoanCommissions() {
  return post<{ created: number; skipped: number; message?: string }>(
    ADMIN_API_PATHS.commissionSyncChoiceLoans
  );
}

export async function updateLedgerStatus(
  id: string,
  status: "pending" | "approved" | "paid"
) {
  return patch<CommissionLedgerRow>(ADMIN_API_PATHS.commissionLedgerStatus(id), { status });
}

export interface CommissionWallet {
  pendingApproval: number;
  available: number;
  reserved: number;
  withdrawn: number;
  totalEarned: number;
  openWithdrawal: boolean;
  bank?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
  };
}

export interface CommissionTransaction {
  _id: string;
  type: "credit" | "debit";
  status: "pending" | "completed" | "reversed";
  amount: number;
  description: string;
  createdAt: string;
}

export interface CommissionWithdrawal {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  adminNote?: string;
  createdAt: string;
  processedAt?: string;
  userId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
  };
}

export interface WithdrawalRequestInput {
  amount: number;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

export async function getCommissionWallet() {
  return get<CommissionWallet>(ADMIN_API_PATHS.commissionWallet);
}

export async function getCommissionTransactions(url: string) {
  return get<{
    transactions: CommissionTransaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(url);
}

export async function getCommissionWithdrawals(url: string) {
  return get<{
    withdrawals: CommissionWithdrawal[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(url);
}

export async function requestCommissionWithdrawal(input: WithdrawalRequestInput) {
  return post<CommissionWithdrawal>(ADMIN_API_PATHS.commissionWithdrawals, input);
}

export async function updateWithdrawalStatus(
  id: string,
  status: "approved" | "rejected" | "paid",
  adminNote?: string
) {
  return patch<CommissionWithdrawal>(ADMIN_API_PATHS.commissionWithdrawalStatus(id), {
    status,
    adminNote,
  });
}
