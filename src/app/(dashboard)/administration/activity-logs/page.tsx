"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  IconRefresh,
  IconClock,
  IconFilter,
} from "@tabler/icons-react";
import {
  getActivityLogs,
  type AdminActivityLog,
} from "@/lib/services/activityLogService";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";

export default function ActivityLogsPage(): React.JSX.Element {
  const { t } = useTranslations();
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasNextPage, setHasNextPage] = useState(false);
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActivityLogs({
        page,
        limit,
        module: moduleFilter || undefined,
        action: actionFilter || undefined,
      });
      setLogs(data);
      setHasNextPage(data.length === limit);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("activityLogs.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [page, moduleFilter, actionFilter, t, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("activityLogs.title")}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{t("activityLogs.subtitle")}</p>
        </div>
        <button
          onClick={() => fetchLogs()}
          className="group flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 shadow-sm"
        >
          <IconRefresh className={twMerge("h-4.5 w-4.5 transition-transform duration-500", loading && "animate-spin")} />
          {t("common.refresh")}
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconFilter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            placeholder={t("activityLogs.filterByModule")}
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 shadow-sm"
          />
        </div>
        <div className="relative flex-1">
          <IconFilter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            placeholder={t("activityLogs.filterByAction")}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 shadow-sm"
          />
        </div>
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
                <th className="px-8 py-5">{t("activityLogs.admin")}</th>
                <th className="px-8 py-5">{t("activityLogs.module")}</th>
                <th className="px-8 py-5">{t("activityLogs.action")}</th>
                <th className="px-8 py-5">{t("activityLogs.timestamp")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-background/50">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <IconRefresh className="h-10 w-10 animate-spin text-primary opacity-20" />
                      <p className="text-sm font-bold text-muted-foreground">{t("activityLogs.loading")}</p>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <IconClock className="h-12 w-12 text-primary" />
                      <p className="text-sm font-bold">{t("activityLogs.noLogs")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-muted/30 transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                          <span className="text-sm font-black">{log.admin?.firstName?.[0] || "?"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">
                            {log.admin ? `${log.admin.firstName} ${log.admin.lastName}` : "System"}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{log.admin?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <span className="font-bold text-foreground">{log.action}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground">
                          {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                           {new Date(log.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border p-6 bg-muted/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-6 py-4 shadow-sm">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {t("common.page")} {page}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-background active:scale-95 shadow-sm"
                aria-label={t("common.previous")}
              >
                {t("common.previous")}
              </button>

              <button
                type="button"
                disabled={!hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-background active:scale-95 shadow-sm"
                aria-label={t("common.next")}
              >
                {t("common.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
