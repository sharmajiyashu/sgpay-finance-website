"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  IconRefresh,
  IconUser,
  IconCalendar,
  IconCheck,
  IconX,
  IconTrash,
  IconClock,
  IconFileText
} from "@tabler/icons-react";
import {
  getAccountDeletionRequests,
  updateAccountDeletionStatus,
  deleteAccountDeletionRequest,
  type AccountDeletionRequest,
} from "@/lib/services/accountDeletionService";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";
import { Pagination } from "@/components/ui/Pagination";

export default function AccountDeletionsPage(): React.JSX.Element {
  const { t } = useTranslations();
  const [requests, setRequests] = useState<AccountDeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAccountDeletionRequests({ page, limit: 10 });
      setRequests(data.requests);
      setTotalPages(data.pagination.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("accountDeletions.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [page, t]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleStatusUpdate(id: number, status: AccountDeletionRequest["status"]) {
    try {
      await updateAccountDeletionStatus(id, { status });
      fetchRequests();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.updateFailed"));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t("common.deleteConfirmTitle" as any) || "Are you sure?")) return;
    try {
      await deleteAccountDeletionRequest(id);
      fetchRequests();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.deleteFailed" as any));
    }
  }

  const statusColors = {
    pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    approved: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("accountDeletions.title")}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{t("accountDeletions.subtitle")}</p>
        </div>
        <button
          onClick={() => fetchRequests()}
          className="group flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 shadow-sm"
        >
          <IconRefresh className={twMerge("h-4.5 w-4.5 transition-transform duration-500", loading && "animate-spin")} />
          {t("common.refresh")}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-bold text-destructive animate-in fade-in">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70">
              <tr>
                <th className="px-8 py-5">{t("accountDeletions.user")}</th>
                <th className="px-8 py-5">{t("accountDeletions.reason")}</th>
                <th className="px-8 py-5">{t("accountDeletions.status")}</th>
                <th className="px-8 py-5">{t("accountDeletions.requestedAt")}</th>
                <th className="px-8 py-5 text-right">{t("accountDeletions.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-background/50">
              {loading && requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <IconRefresh className="h-10 w-10 animate-spin text-destructive opacity-20" />
                      <p className="text-sm font-bold text-muted-foreground">Loading Requests...</p>
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <IconTrash className="h-12 w-12 text-destructive" />
                      <p className="text-sm font-bold">{t("accountDeletions.noRequests")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="group hover:bg-muted/30 transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive transition-transform group-hover:scale-110">
                          <span className="text-sm font-black">{request.user.firstName?.[0] || "?"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{request.user.firstName} {request.user.lastName}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{request.user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5 max-w-[240px]">
                        <span className="font-bold text-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {request.reason?.reason || "Other / Not specified"}
                        </span>
                        {request.customReason && (
                          <div className="rounded-xl bg-muted/50 p-2 border border-border/50 text-[11px] font-medium text-muted-foreground italic leading-relaxed">
                            "{request.customReason}"
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={twMerge(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-widest",
                        statusColors[request.status]
                      )}>
                        <span className={twMerge("h-1 w-1 rounded-full", request.status === "pending" ? "bg-orange-500" : request.status === "approved" ? "bg-blue-500" : request.status === "completed" ? "bg-emerald-500" : "bg-red-500")} />
                        {t(`accountDeletions.status.${request.status}` as any)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 font-bold text-muted-foreground">
                        <IconCalendar className="h-4 w-4 opacity-40" />
                        <span className="text-xs uppercase tracking-tighter">
                          {new Date(request.requestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(request.id, "approved")}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 transition-all hover:bg-blue-500 hover:text-white shadow-sm"
                              title={t("accountDeletions.status.approved")}
                            >
                              <IconCheck className="h-5 w-5" stroke={3} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request.id, "rejected")}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                              title={t("accountDeletions.status.rejected")}
                            >
                              <IconX className="h-5 w-5" stroke={3} />
                            </button>
                          </>
                        )}
                        {request.status === "approved" && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, "completed")}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white shadow-sm"
                            title={t("accountDeletions.status.completed")}
                          >
                            <IconCheck className="h-5 w-5" stroke={3} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-destructive hover:border-destructive hover:text-white shadow-sm"
                          title={t("common.delete")}
                        >
                          <IconTrash className="h-5 w-5" stroke={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-border p-6 bg-muted/10">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
