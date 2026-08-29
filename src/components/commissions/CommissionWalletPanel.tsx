"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { Pagination } from "@/components/ui/Pagination";
import {
  RecordCard,
  RecordCardField,
  RecordCardFields,
  RecordCardHeader,
  ResponsiveRecordList,
} from "@/components/ui/ResponsiveRecordList";
import type {
  CommissionTransaction,
  CommissionWallet,
  CommissionWithdrawal,
  WithdrawalRequestInput,
} from "@/sg-admin/lib/services/commissionService";

export function money(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function payoutStatusClass(status: string) {
  if (status === "paid" || status === "completed") return "bg-emerald-500/10 text-emerald-700";
  if (status === "approved") return "bg-sky-500/10 text-sky-700";
  if (status === "rejected" || status === "reversed") return "bg-rose-500/10 text-rose-700";
  return "bg-amber-500/10 text-amber-800";
}

export interface CommissionWalletApi {
  getWallet: () => Promise<CommissionWallet>;
  requestWithdrawal: (input: WithdrawalRequestInput) => Promise<CommissionWithdrawal>;
  getTransactions: (
    page: number
  ) => Promise<{
    transactions: CommissionTransaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  getMyWithdrawals: (
    page: number
  ) => Promise<{
    withdrawals: CommissionWithdrawal[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
}

export function CommissionWalletPanel({
  api,
  queryScope,
}: {
  api: CommissionWalletApi;
  queryScope: string;
}) {
  const queryClient = useQueryClient();
  const [txnPage, setTxnPage] = useState(1);
  const [wdPage, setWdPage] = useState(1);
  const [amount, setAmount] = useState("");
  const [form, setForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });
  const [bankHydrated, setBankHydrated] = useState(false);
  const { data: wallet } = useQuery({
    queryKey: ["commission-wallet", queryScope],
    queryFn: api.getWallet,
  });

  useEffect(() => {
    if (bankHydrated || !wallet?.bank) return;
    setForm({
      accountHolderName: wallet.bank.accountHolderName || "",
      bankName: wallet.bank.bankName || "",
      accountNumber: wallet.bank.accountNumber || "",
      ifsc: wallet.bank.ifsc || "",
    });
    setBankHydrated(true);
  }, [wallet?.bank, bankHydrated]);

  const { data: txnData } = useQuery({
    queryKey: ["commission-transactions", queryScope, txnPage],
    queryFn: () => api.getTransactions(txnPage),
  });

  const { data: wdData } = useQuery({
    queryKey: ["commission-my-withdrawals", queryScope, wdPage],
    queryFn: () => api.getMyWithdrawals(wdPage),
  });

  const withdrawMutation = useMutation({
    mutationFn: () =>
      api.requestWithdrawal({
        amount: Number(amount),
        accountHolderName: form.accountHolderName,
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifsc: form.ifsc,
      }),
    onSuccess: () => {
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["commission-wallet", queryScope] });
      queryClient.invalidateQueries({ queryKey: ["commission-transactions", queryScope] });
      queryClient.invalidateQueries({ queryKey: ["commission-my-withdrawals", queryScope] });
      queryClient.invalidateQueries({ queryKey: ["sidebar-counts"] });
      toast.success("Withdrawal request submitted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const available = wallet?.available ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <WalletCard label="Available to withdraw" value={money(available)} highlight />
        <WalletCard label="Waiting approval" value={money(wallet?.pendingApproval ?? 0)} />
        <WalletCard label="In payout" value={money(wallet?.reserved ?? 0)} />
        <WalletCard label="Withdrawn" value={money(wallet?.withdrawn ?? 0)} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Request withdrawal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only approved commission can be withdrawn. One request can be open at a time.
        </p>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            withdrawMutation.mutate();
          }}
        >
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Amount (₹)</span>
            <input
              type="number"
              min={1}
              step="0.01"
              max={available || undefined}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Account holder</span>
            <input
              value={form.accountHolderName}
              onChange={(e) => setForm((p) => ({ ...p, accountHolderName: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Bank name</span>
            <input
              value={form.bankName}
              onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Account number</span>
            <input
              value={form.accountNumber}
              onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">IFSC</span>
            <input
              value={form.ifsc}
              onChange={(e) => setForm((p) => ({ ...p, ifsc: e.target.value.toUpperCase() }))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 uppercase"
              required
              maxLength={11}
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={withdrawMutation.isPending || wallet?.openWithdrawal || available < 1}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {wallet?.openWithdrawal ? "Request already open" : "Submit request"}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="px-1 font-semibold">Transaction history</h2>
        <ResponsiveRecordList
          isEmpty={txnData !== undefined && (txnData.transactions || []).length === 0}
          emptyMessage="No transactions yet"
          table={
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {txnData?.transactions.map((row) => (
                  <tr key={row._id} className="border-b border-border/50">
                    <td className="px-4 py-3 capitalize">{row.type}</td>
                    <td className="px-4 py-3">{row.description}</td>
                    <td
                      className={twMerge(
                        "px-4 py-3 font-medium",
                        row.type === "credit" ? "text-emerald-700" : "text-rose-700"
                      )}
                    >
                      {row.type === "credit" ? "+" : "-"}
                      {money(row.amount)}
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
                  </tr>
                ))}
              </tbody>
            </table>
          }
          cards={(txnData?.transactions || []).map((row) => (
            <RecordCard key={row._id}>
              <RecordCardHeader
                title={row.description}
                subtitle={row.type}
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
                  label="Amount"
                  value={
                    <span className={row.type === "credit" ? "text-emerald-700" : "text-rose-700"}>
                      {row.type === "credit" ? "+" : "-"}
                      {money(row.amount)}
                    </span>
                  }
                />
                <RecordCardField label="Date" value={new Date(row.createdAt).toLocaleString()} />
              </RecordCardFields>
            </RecordCard>
          ))}
        />
        {txnData?.pagination && (
          <Pagination
            page={txnData.pagination.page}
            totalPages={txnData.pagination.totalPages}
            total={txnData.pagination.total}
            limit={txnData.pagination.limit}
            onPageChange={setTxnPage}
          />
        )}
      </div>

      <div className="space-y-3">
        <h2 className="px-1 font-semibold">My withdrawal requests</h2>
        <ResponsiveRecordList
          isEmpty={wdData !== undefined && (wdData.withdrawals || []).length === 0}
          emptyMessage="No withdrawal requests"
          table={
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Bank</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Requested</th>
                </tr>
              </thead>
              <tbody>
                {wdData?.withdrawals.map((row) => (
                  <tr key={row._id} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium">{money(row.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.bankName} · {row.accountNumber} · {row.ifsc}
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
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          cards={(wdData?.withdrawals || []).map((row) => (
            <RecordCard key={row._id}>
              <RecordCardHeader
                title={money(row.amount)}
                subtitle={`${row.bankName} · ${row.accountNumber} · ${row.ifsc}`}
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
                  label="Requested"
                  value={new Date(row.createdAt).toLocaleDateString()}
                />
              </RecordCardFields>
            </RecordCard>
          ))}
        />
        {wdData?.pagination && (
          <Pagination
            page={wdData.pagination.page}
            totalPages={wdData.pagination.totalPages}
            total={wdData.pagination.total}
            limit={wdData.pagination.limit}
            onPageChange={setWdPage}
          />
        )}
      </div>
    </div>
  );
}

function WalletCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "rounded-2xl border bg-card p-4 shadow-sm",
        highlight ? "border-primary/30 bg-primary/5" : "border-border"
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}
