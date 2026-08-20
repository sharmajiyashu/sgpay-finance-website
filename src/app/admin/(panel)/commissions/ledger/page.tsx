"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listUrl, unwrapList } from "@/sg-admin/lib/paginated-list";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import {
  getCommissionLedger,
  updateLedgerStatus,
  type CommissionLedgerRow,
} from "@/sg-admin/lib/services/commissionService";
import { COMMISSION_LEVEL_LABELS } from "@/sg-admin/lib/types/hierarchy";
import { Pagination } from "@/components/ui/Pagination";
import { hasPermission } from "@/sg-admin/lib/permissions";

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

export default function CommissionLedgerPage() {
  const queryClient = useQueryClient();
  const canUpdate = hasPermission("admin:commission:update");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const url = listUrl(ADMIN_API_PATHS.commissionLedger, page, "", 20, {
    status: statusFilter || undefined,
    productType: "credit-card",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["commission-ledger", page, statusFilter],
    queryFn: () => getCommissionLedger(url),
  });

  const { items: ledger, pagination } = unwrapList<CommissionLedgerRow>(
    data as Record<string, unknown> | undefined,
    "ledger"
  );

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commission Ledger</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Credit-card commission cascade entries
        </p>
      </div>

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
                <th className="px-4 py-3 font-medium">Beneficiary</th>
                <th className="px-4 py-3 font-medium">From sale</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Base</th>
                <th className="px-4 py-3 font-medium">%</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : ledger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No commission entries yet
                  </td>
                </tr>
              ) : (
                ledger.map((row) => (
                  <tr key={row._id} className="border-b border-border/50 align-top">
                    <td className="px-4 py-3">{personName(row.beneficiaryUserId)}</td>
                    <td className="px-4 py-3">
                      <div>{personName(row.fromUserId)}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.leadId?.customerName || row.leadId?.status || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {row.level
                        ? COMMISSION_LEVEL_LABELS[row.level] || row.level
                        : "—"}
                    </td>
                    <td className="px-4 py-3">₹{row.amountBase}</td>
                    <td className="px-4 py-3">{row.percent}%</td>
                    <td className="px-4 py-3 font-medium">₹{row.commissionAmount}</td>
                    <td className="px-4 py-3">
                      {canUpdate ? (
                        <select
                          value={row.status}
                          disabled={statusMutation.isPending}
                          onChange={(e) =>
                            statusMutation.mutate({
                              id: row._id,
                              status: e.target.value as "pending" | "approved" | "paid",
                            })
                          }
                          className="rounded-lg border border-border bg-background px-2 py-1 text-xs capitalize"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="paid">Paid</option>
                        </select>
                      ) : (
                        <span className="capitalize">{row.status}</span>
                      )}
                    </td>
                  </tr>
                ))
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
