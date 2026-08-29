"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { listUrl, unwrapList } from "@/sg-admin/lib/paginated-list";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import {
  getCommissionLedger,
  syncChoiceLoanCommissions,
  updateLedgerStatus,
  type CommissionLedgerRow,
  type CommissionLedgerSummary,
} from "@/sg-admin/lib/services/commissionService";
import { COMMISSION_LEVEL_LABELS } from "@/sg-admin/lib/types/hierarchy";
import {
  COMMISSION_PRODUCT_TYPES,
  formatProductLabel,
  isLoanProductType,
} from "@/lib/choiceConnect/types";
import { Pagination } from "@/components/ui/Pagination";
import { hasPermission } from "@/sg-admin/lib/permissions";

const CASCADE_ORDER = [
  "retailer",
  "distributor",
  "super_distributor",
  "rm",
  "asm",
  "state_head",
];

function personName(person?: {
  firstName?: string;
  lastName?: string;
  email?: string;
}): string {
  if (!person) return "—";
  return (
    [person.firstName, person.lastName].filter(Boolean).join(" ").trim() ||
    person.email ||
    "—"
  );
}

function money(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function saleKey(row: CommissionLedgerRow) {
  return row.leadId?._id
    ? `lead:${row.leadId._id}`
    : row.enquiryId?._id
      ? `enquiry:${row.enquiryId._id}`
      : row._id;
}

function saleLabel(row: CommissionLedgerRow) {
  if (row.enquiryId) {
    return row.enquiryId.name || "Roar enquiry";
  }
  return row.leadId?.customerName || "Choice Connect sale";
}

function sourceLabel(row: CommissionLedgerRow) {
  if (row.source === "roar" || row.enquiryId) return "Roar Credit Card";
  if (isLoanProductType(row.productType) || isLoanProductType(row.leadId?.productType)) {
    return "Choice Loan";
  }
  return "Choice Credit Card";
}

function statusClass(status: string) {
  if (status === "paid") return "bg-emerald-500/10 text-emerald-700";
  if (status === "approved") return "bg-sky-500/10 text-sky-700";
  return "bg-amber-500/10 text-amber-800";
}

export default function CommissionLedgerPage() {
  const queryClient = useQueryClient();
  const canUpdate = hasPermission("admin:commission:update");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const url = listUrl(ADMIN_API_PATHS.commissionLedger, page, "", 20, {
    status: statusFilter || undefined,
    productType: productFilter || undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["commission-ledger", page, statusFilter, productFilter],
    queryFn: () => getCommissionLedger(url),
  });

  const { items: ledger, pagination } = unwrapList<CommissionLedgerRow>(
    data as Record<string, unknown> | undefined,
    "ledger"
  );
  const summary = (data as { summary?: CommissionLedgerSummary } | undefined)?.summary;

  const groups = useMemo(() => {
    const map = new Map<string, CommissionLedgerRow[]>();
    for (const row of ledger) {
      const key = saleKey(row);
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    return Array.from(map.entries()).map(([key, rows]) => ({
      key,
      rows: [...rows].sort(
        (a, b) =>
          CASCADE_ORDER.indexOf(a.level || "") - CASCADE_ORDER.indexOf(b.level || "")
      ),
    }));
  }, [ledger]);

  const syncMutation = useMutation({
    mutationFn: syncChoiceLoanCommissions,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["commission-ledger"] });
      toast.success(
        result.message ||
          `Synced Choice loans (${result.created ?? 0} created, ${result.skipped ?? 0} skipped)`
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "approved" | "paid";
    }) => updateLedgerStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-ledger"] });
      toast.success("Ledger status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Commission Ledger</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cascade entries for Choice credit cards, Choice loans, and Roar. Each upline
            role earns its own % of the same base.
          </p>
        </div>
        {canUpdate && (
          <button
            type="button"
            disabled={syncMutation.isPending}
            onClick={() => syncMutation.mutate()}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-60"
          >
            {syncMutation.isPending ? "Syncing…" : "Sync Choice loans"}
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Entries" value={String(summary?.count ?? pagination?.total ?? 0)} />
        <SummaryCard label="Total commission" value={money(summary?.totalAmount ?? 0)} />
        <SummaryCard label="Pending" value={money(summary?.pendingAmount ?? 0)} />
        <SummaryCard label="Paid" value={money(summary?.paidAmount ?? 0)} />
      </div>

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
          {error instanceof Error ? error.message : "Failed to load ledger"}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Sale / cascade</th>
                <th className="px-4 py-3 font-medium">Beneficiary</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Base</th>
                <th className="px-4 py-3 font-medium">%</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No commission entries yet. Entries appear when a credit-card sale
                    is issued/approved, a Choice loan is disbursed/done, or a Roar
                    enquiry is marked resolved.
                  </td>
                </tr>
              ) : (
                groups.flatMap((group) => {
                  const head = group.rows[0];
                  if (!head) return [];
                  const saleTotal = group.rows.reduce(
                    (sum, row) => sum + (row.commissionAmount || 0),
                    0
                  );
                  return [
                    <tr key={`${group.key}-head`} className="border-b border-border/40 bg-muted/20">
                      <td colSpan={8} className="px-4 py-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-foreground">{saleLabel(head)}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {sourceLabel(head)}
                              {head.productType ? ` · ${formatProductLabel(head.productType)}` : ""}
                              {" · referred by "}
                              {personName(head.fromUserId)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Cascade total {money(saleTotal)}
                          </span>
                        </div>
                      </td>
                    </tr>,
                    ...group.rows.map((row) => (
                      <tr key={row._id} className="border-b border-border/50 align-top">
                        <td className="px-4 py-3 text-muted-foreground">
                          {personName(row.fromUserId)}
                        </td>
                        <td className="px-4 py-3">{personName(row.beneficiaryUserId)}</td>
                        <td className="px-4 py-3">
                          {row.level ? COMMISSION_LEVEL_LABELS[row.level] || row.level : "—"}
                        </td>
                        <td className="px-4 py-3">{money(row.amountBase)}</td>
                        <td className="px-4 py-3">{row.percent}%</td>
                        <td className="px-4 py-3 font-medium">{money(row.commissionAmount)}</td>
                        <td className="px-4 py-3">
                          {canUpdate ? (
                            <select
                              value={row.status}
                              disabled={statusMutation.isPending}
                              onChange={(e) => {
                                const next = e.target.value as "pending" | "approved" | "paid";
                                if (next === row.status) return;
                                statusMutation.mutate({ id: row._id, status: next });
                              }}
                              className={twMerge(
                                "rounded-lg border px-2 py-1 text-xs capitalize",
                                statusClass(row.status)
                              )}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="paid">Paid</option>
                            </select>
                          ) : (
                            <span
                              className={twMerge(
                                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                                statusClass(row.status)
                              )}
                            >
                              {row.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    )),
                  ];
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}
