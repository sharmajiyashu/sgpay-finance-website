"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { AGENT_API_PATHS } from "@/lib/config/env";
import {
  getAgentTransactions,
  getAgentWallet,
  getAgentWithdrawals,
  getMyCommissions,
  requestAgentWithdrawal,
} from "@/sg-agent/lib/services/commissionService";
import { COMMISSION_LEVEL_LABELS } from "@/sg-admin/lib/types/hierarchy";
import {
  COMMISSION_PRODUCT_TYPES,
  formatProductLabel,
  isLoanProductType,
} from "@/lib/choiceConnect/types";
import { Pagination } from "@/components/ui/Pagination";
import {
  RecordCard,
  RecordCardField,
  RecordCardFields,
  RecordCardHeader,
  ResponsiveRecordList,
} from "@/components/ui/ResponsiveRecordList";
import {
  CommissionWalletPanel,
  money,
  payoutStatusClass,
} from "@/components/commissions/CommissionWalletPanel";

export default function AgentCommissionsPage() {
  const [tab, setTab] = useState<"wallet" | "earnings">("wallet");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const params = new URLSearchParams({
    page: String(page),
    limit: "20",
  });
  if (statusFilter) params.set("status", statusFilter);
  if (productFilter) params.set("productType", productFilter);

  const { data, isLoading, error } = useQuery({
    queryKey: ["agent-commissions", page, statusFilter, productFilter],
    queryFn: () => getMyCommissions(`${AGENT_API_PATHS.commissions}?${params.toString()}`),
    enabled: tab === "earnings",
  });

  const ledger = data?.ledger || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track earnings, withdraw approved amount, and view transaction history
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "wallet"} onClick={() => setTab("wallet")}>
          Wallet & history
        </TabButton>
        <TabButton active={tab === "earnings"} onClick={() => setTab("earnings")}>
          Earnings
        </TabButton>
      </div>

      {tab === "wallet" ? (
        <CommissionWalletPanel
          queryScope="agent"
          api={{
            getWallet: getAgentWallet,
            requestWithdrawal: requestAgentWithdrawal,
            getTransactions: getAgentTransactions,
            getMyWithdrawals: getAgentWithdrawals,
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm sm:w-auto"
            >
              <option value="">All products</option>
              {COMMISSION_PRODUCT_TYPES.map((product) => (
                <option key={product.value} value={product.value}>
                  {product.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm sm:w-auto"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Failed to load commissions"}
            </p>
          )}

          <ResponsiveRecordList
            isLoading={isLoading}
            isEmpty={!isLoading && ledger.length === 0}
            loadingMessage="Loading..."
            emptyMessage="No commissions yet"
            table={
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Sale from</th>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Level</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((row) => (
                    <tr key={row._id} className="border-b border-border/50">
                      <td className="px-4 py-3">
                        {[row.fromUserId?.firstName, row.fromUserId?.lastName]
                          .filter(Boolean)
                          .join(" ") ||
                          row.fromUserId?.email ||
                          "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatProductLabel(row.productType || row.leadId?.productType || "credit-card")}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.source === "roar" || row.enquiryId
                          ? "Roar"
                          : isLoanProductType(row.productType)
                            ? "Choice Loan"
                            : "Choice Credit Card"}
                      </td>
                      <td className="px-4 py-3">
                        {row.level ? COMMISSION_LEVEL_LABELS[row.level] || row.level : "—"}
                      </td>
                      <td className="px-4 py-3 font-medium">{money(row.commissionAmount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={twMerge(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                            payoutStatusClass(row.status)
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
            cards={ledger.map((row) => (
              <RecordCard key={row._id}>
                <RecordCardHeader
                  title={
                    [row.fromUserId?.firstName, row.fromUserId?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                    row.fromUserId?.email ||
                    "—"
                  }
                  subtitle={formatProductLabel(row.productType || row.leadId?.productType || "credit-card")}
                  badge={
                    <span
                      className={twMerge(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                        payoutStatusClass(row.status)
                      )}
                    >
                      {row.status}
                    </span>
                  }
                />
                <RecordCardFields>
                  <RecordCardField
                    label="Source"
                    value={
                      row.source === "roar" || row.enquiryId
                        ? "Roar"
                        : isLoanProductType(row.productType)
                          ? "Choice Loan"
                          : "Choice Credit Card"
                    }
                  />
                  <RecordCardField
                    label="Level"
                    value={row.level ? COMMISSION_LEVEL_LABELS[row.level] || row.level : "—"}
                  />
                  <RecordCardField label="Amount" value={money(row.commissionAmount)} />
                  <RecordCardField
                    label="Date"
                    value={row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                  />
                </RecordCardFields>
              </RecordCard>
            ))}
          />

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "rounded-full px-4 py-2 text-sm font-medium",
        active ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}
