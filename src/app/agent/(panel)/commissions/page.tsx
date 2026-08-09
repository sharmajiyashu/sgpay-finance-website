"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AGENT_API_PATHS } from "@/lib/config/env";
import { getMyCommissions } from "@/sg-agent/lib/services/commissionService";
import { Pagination } from "@/components/ui/Pagination";

export default function AgentCommissionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const params = new URLSearchParams({
    page: String(page),
    limit: "20",
  });
  if (statusFilter) params.set("status", statusFilter);

  const { data, isLoading, error } = useQuery({
    queryKey: ["agent-commissions", page, statusFilter],
    queryFn: () => getMyCommissions(`${AGENT_API_PATHS.commissions}?${params.toString()}`),
  });

  const ledger = data?.ledger || [];
  const pagination = data?.pagination;
  const totalEarned = ledger.reduce((sum, row) => sum + (row.commissionAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your credit-card commission earnings
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="text-sm text-muted-foreground">Page total</div>
        <div className="text-2xl font-bold">₹{totalEarned.toFixed(2)}</div>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="paid">Paid</option>
      </select>

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load commissions"}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Sale from</th>
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
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : ledger.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No commissions yet
                </td>
              </tr>
            ) : (
              ledger.map((row) => (
                <tr key={row._id} className="border-b border-border/50">
                  <td className="px-4 py-3">
                    {[row.fromUserId?.firstName, row.fromUserId?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                      row.fromUserId?.email ||
                      "—"}
                  </td>
                  <td className="px-4 py-3">₹{row.amountBase}</td>
                  <td className="px-4 py-3">{row.percent}%</td>
                  <td className="px-4 py-3 font-medium">₹{row.commissionAmount}</td>
                  <td className="px-4 py-3 capitalize">{row.status}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
