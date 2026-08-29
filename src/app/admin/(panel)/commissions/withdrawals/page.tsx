"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { listUrl, unwrapList } from "@/sg-admin/lib/paginated-list";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import {
  getCommissionWithdrawals,
  updateWithdrawalStatus,
  type CommissionWithdrawal,
} from "@/sg-admin/lib/services/commissionService";
import { Pagination } from "@/components/ui/Pagination";
import {
  RecordCard,
  RecordCardActions,
  RecordCardField,
  RecordCardFields,
  RecordCardHeader,
  ResponsiveRecordList,
} from "@/components/ui/ResponsiveRecordList";
import { money, payoutStatusClass } from "@/components/commissions/CommissionWalletPanel";
import { hasPermission } from "@/sg-admin/lib/permissions";

function personName(person?: { firstName?: string; lastName?: string; email?: string }) {
  if (!person) return "—";
  return [person.firstName, person.lastName].filter(Boolean).join(" ").trim() || person.email || "—";
}

export default function AdminWithdrawalsPage() {
  const queryClient = useQueryClient();
  const canUpdate = hasPermission("admin:commission:update");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");

  const url = listUrl(ADMIN_API_PATHS.commissionWithdrawals, page, "", 20, {
    status: statusFilter || undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["commission-withdrawals", page, statusFilter],
    queryFn: () => getCommissionWithdrawals(url),
  });

  const { items: withdrawals, pagination } = unwrapList<CommissionWithdrawal>(
    data as Record<string, unknown> | undefined,
    "withdrawals"
  );

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected" | "paid";
    }) => updateWithdrawalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["sidebar-counts"] });
      toast.success("Withdrawal updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Withdrawals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review commission withdrawal requests and mark them paid after transfer
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
        <option value="rejected">Rejected</option>
      </select>

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load withdrawals"}
        </p>
      )}

      <ResponsiveRecordList
        isLoading={isLoading}
        isEmpty={!isLoading && withdrawals.length === 0}
        loadingMessage="Loading..."
        emptyMessage="No withdrawal requests"
        table={
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Bank</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Requested</th>
                {canUpdate && <th className="px-4 py-3 font-medium">Action</th>}
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((row) => (
                <tr key={row._id} className="border-b border-border/50 align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{personName(row.userId)}</div>
                    <div className="text-xs text-muted-foreground">{row.userId?.email}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{money(row.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{row.accountHolderName}</div>
                    <div className="text-xs">
                      {row.bankName} · {row.accountNumber} · {row.ifsc}
                    </div>
                  </td>
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
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  {canUpdate && (
                    <td className="px-4 py-3">
                      {row.status === "pending" && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                            onClick={() =>
                              statusMutation.mutate({ id: row._id, status: "approved" })
                            }
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-border px-3 py-1.5 text-xs"
                            onClick={() =>
                              statusMutation.mutate({ id: row._id, status: "rejected" })
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {row.status === "approved" && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
                            onClick={() => statusMutation.mutate({ id: row._id, status: "paid" })}
                          >
                            Mark paid
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-border px-3 py-1.5 text-xs"
                            onClick={() =>
                              statusMutation.mutate({ id: row._id, status: "rejected" })
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        }
        cards={withdrawals.map((row) => (
          <RecordCard key={row._id}>
            <RecordCardHeader
              title={personName(row.userId)}
              subtitle={row.userId?.email}
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
              <RecordCardField label="Amount" value={money(row.amount)} />
              <RecordCardField
                label="Bank"
                value={`${row.accountHolderName} · ${row.bankName} · ${row.accountNumber} · ${row.ifsc}`}
              />
              <RecordCardField
                label="Requested"
                value={new Date(row.createdAt).toLocaleString()}
              />
            </RecordCardFields>
            {canUpdate && (row.status === "pending" || row.status === "approved") ? (
              <RecordCardActions>
                {row.status === "pending" && (
                  <>
                    <button
                      type="button"
                      className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                      onClick={() => statusMutation.mutate({ id: row._id, status: "approved" })}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                      onClick={() => statusMutation.mutate({ id: row._id, status: "rejected" })}
                    >
                      Reject
                    </button>
                  </>
                )}
                {row.status === "approved" && (
                  <>
                    <button
                      type="button"
                      className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
                      onClick={() => statusMutation.mutate({ id: row._id, status: "paid" })}
                    >
                      Mark paid
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                      onClick={() => statusMutation.mutate({ id: row._id, status: "rejected" })}
                    >
                      Reject
                    </button>
                  </>
                )}
              </RecordCardActions>
            ) : null}
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
  );
}
