"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import {
  IconRefresh,
  IconAlertTriangle,
  IconUser,
  IconCheck,
  IconX,
  IconShieldExclamation,
} from "@tabler/icons-react";
import {
  getReports,
  updateReportStatus,
  getSuspiciousAccounts,
  type Report,
  type SuspiciousAccount,
} from "@/lib/services/reportService";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";
import { Pagination } from "@/components/ui/Pagination";

export default function ReportsPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [suspicious, setSuspicious] = React.useState<SuspiciousAccount[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("reports");

  const refreshReports = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReports({});
      setReports(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("reports.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const refreshSuspicious = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuspiciousAccounts();
      setSuspicious(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("reports.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  React.useEffect(() => {
    if (activeTab === "reports") refreshReports();
    else refreshSuspicious();
  }, [activeTab, refreshReports, refreshSuspicious]);

  async function handleStatusUpdate(id: number, status: Report["status"]) {
    try {
      await updateReportStatus(id, { status });
      refreshReports();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.updateFailed"));
    }
  }

  const statusColors = {
    pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    dismissed: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("reports.title")}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{t("reports.subtitle")}</p>
        </div>
        <button
          onClick={() => (activeTab === "reports" ? refreshReports() : refreshSuspicious())}
          className="group flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 shadow-sm"
        >
          <IconRefresh className={twMerge("h-4.5 w-4.5 transition-transform duration-500", loading && "animate-spin")} />
          {t("common.refresh")}
        </button>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex w-fit gap-2 rounded-[2rem] border border-border bg-muted/30 p-1.5 shadow-inner">
          <Tabs.Trigger
            value="reports"
            className="flex items-center gap-2.5 rounded-[1.5rem] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md"
          >
            <IconAlertTriangle className="h-4 w-4" />
            {t("reports.tabReports")}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="suspicious"
            className="flex items-center gap-2.5 rounded-[1.5rem] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md"
          >
            <IconShieldExclamation className="h-4 w-4" />
            {t("reports.tabSuspicious")}
          </Tabs.Trigger>
        </Tabs.List>

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-bold text-destructive animate-in fade-in">
            {error}
          </div>
        )}

        <Tabs.Content value="reports" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/30 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70">
                  <tr>
                    <th className="px-8 py-5">{t("reports.reporter")}</th>
                    <th className="px-8 py-5">{t("reports.reported")}</th>
                    <th className="px-8 py-5">{t("reports.reason")}</th>
                    <th className="px-8 py-5">{t("reports.status")}</th>
                    <th className="px-8 py-5 text-right">{t("reports.updateStatus")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 bg-background/50">
                  {loading && reports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <IconRefresh className="h-10 w-10 animate-spin text-primary opacity-20" />
                          <p className="text-sm font-bold text-muted-foreground">Loading Reports...</p>
                        </div>
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                          <IconAlertTriangle className="h-12 w-12" />
                          <p className="text-sm font-bold">{t("reports.noReports")}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report.id} className="group hover:bg-muted/30 transition-all duration-300">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                              <span className="text-sm font-black">{report.reporter?.firstName?.[0] || "?"}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">{report.reporter?.firstName}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{report.reporter?.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {report.reportedUser ? (
                            <div className="flex items-center gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive transition-transform group-hover:scale-110">
                                <IconShieldExclamation className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col border-l border-border pl-4">
                                <span className="font-bold text-foreground">{report.reportedUser?.firstName}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{report.reportedUser?.email}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-xs font-bold text-muted-foreground italic">
                              System/Content
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <p className="max-w-[240px] line-clamp-2 text-sm font-medium text-muted-foreground leading-relaxed">
                            {report.reason}
                          </p>
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={twMerge(
                              "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest border",
                              statusColors[report.status]
                            )}
                          >
                            {t(`reports.status.${report.status}`)}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                            {report.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(report.id, "resolved")}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white shadow-sm"
                                  title={t("reports.status.resolved")}
                                >
                                  <IconCheck className="h-5 w-5" stroke={3} />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(report.id, "dismissed")}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 transition-all hover:bg-orange-500 hover:text-white shadow-sm"
                                  title={t("reports.status.dismissed")}
                                >
                                  <IconX className="h-5 w-5" stroke={3} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="suspicious" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/30 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70">
                  <tr>
                    <th className="px-8 py-5">{t("reports.suspiciousUser")}</th>
                    <th className="px-8 py-5">{t("reports.reportCount")}</th>
                    <th className="px-8 py-5 text-right font-black">Risk Level</th>
                    <th className="px-8 py-5 text-right">{t("userManagement.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 bg-background/50">
                  {loading && suspicious.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <IconRefresh className="mx-auto h-10 w-10 animate-spin text-primary opacity-20" />
                      </td>
                    </tr>
                  ) : suspicious.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                          <IconShieldExclamation className="h-12 w-12" />
                          <p className="text-sm font-bold">{t("reports.noSuspicious")}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    suspicious.map((item) => (
                      <tr key={item.userId} className="group hover:bg-muted/30 transition-all duration-300">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive font-black transition-transform group-hover:scale-110">
                              {item.userId}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">User Profile</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">ID #{item.userId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center rounded-2xl bg-destructive/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-destructive">
                              {item.reportCount} Reports
                            </span>
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-muted shadow-inner">
                              <div
                                className="h-full bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000"
                                style={{ width: `${Math.min((item.reportCount / 5) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={twMerge(
                            "text-[10px] font-black uppercase tracking-[0.2em]",
                            item.reportCount > 3 ? "text-destructive" : "text-orange-500"
                          )}>
                            {item.reportCount > 3 ? "Critical" : "High Risk"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <button
                              onClick={() => router.push(`/user-management/${item.userId}`)}
                              className="rounded-2xl border border-border bg-card px-5 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary hover:border-primary hover:text-white active:scale-95 shadow-sm"
                            >
                              {t("userManagement.viewDetail")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
