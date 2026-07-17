"use client";

import * as React from "react";
import { IconSearch, IconFilter, IconRefresh, IconCreditCard, IconUser, IconPackage, IconCalendar, IconCheck, IconX, IconExternalLink, IconBrandApple, IconBrandAndroid, IconClock, IconTrendingUp } from "@tabler/icons-react";
import {
  getSubscriptions,
  type Subscription,
  type SubscriptionPagination,
} from "@/lib/services/subscriptionService";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";
import { Pagination } from "@/components/ui/Pagination";

export default function SubscriptionsPage() {
  const { t } = useTranslations();
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [pagination, setPagination] = React.useState<SubscriptionPagination>({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const refresh = React.useCallback(async (page = pagination.page) => {
    setError(null);
    setLoading(true);
    try {
      // The backend service supports userId as filter, but for the main list 
      // we usually show all. If search is provided, it might needs a different approach 
      // but for now we follow the filter schema provided.
      const data = await getSubscriptions({
        page,
        limit: pagination.limit,
        // search is not directly in the backend filter provided, but we can pass it if supported
        // for now let's assume we can filter by userId if numeric
      });
      setSubscriptions(data.subscriptions);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("subscriptions.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t, pagination.page, pagination.limit]);

  React.useEffect(() => {
    refresh(1);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("subscriptions.title")}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{t("subscriptions.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refresh()}
            className="group flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 shadow-sm"
          >
            <IconRefresh className={twMerge("h-4.5 w-4.5 transition-transform duration-500", loading && "animate-spin")} />
            {t("common.refresh")}
          </button>
        </div>
      </div>


      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            placeholder={t("userManagement.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 shadow-sm"
          />
        </div>
        <button className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 text-sm font-bold text-muted-foreground transition-all hover:bg-muted active:scale-95 shadow-sm">
          <IconFilter className="h-5 w-5" />
          {t("common.filter")}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-bold text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70">
              <tr>
                <th className="px-8 py-5">{t("subscriptions.userName")}</th>
                <th className="px-8 py-5">{t("subscriptions.packageName")}</th>
                <th className="px-8 py-5">{t("subscriptions.platform")}</th>
                <th className="px-8 py-5">{t("subscriptions.status")}</th>
                <th className="px-8 py-5">{t("subscriptions.expiresAt")}</th>
                <th className="px-8 py-5 text-right">{t("userManagement.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-background/50">
              {loading && subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative h-12 w-12 text-primary">
                        <IconRefresh className="h-full w-full animate-spin opacity-20" />
                        <IconCreditCard className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground">{t("subscriptions.loading")}</p>
                    </div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <IconCreditCard className="h-12 w-12" />
                      <p className="text-sm font-bold">{t("subscriptions.noSubscriptions")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-muted/30 transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                          <span className="text-sm font-black">{sub.user?.firstName?.[0] || <IconUser className="h-5 w-5" />}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{sub.user?.firstName} {sub.user?.lastName}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{sub.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{sub.package?.tier || "Unknown"}</span>
                        <span className="text-xs font-bold text-primary">
                          {sub.package?.price} {sub.package?.currency}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {sub.platform?.toLowerCase().includes("ios") || sub.platform?.toLowerCase().includes("apple") ? (
                          <IconBrandApple className="h-5 w-5 text-foreground" />
                        ) : sub.platform?.toLowerCase().includes("android") ? (
                          <IconBrandAndroid className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <IconCreditCard className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-[11px] font-black uppercase tracking-tighter text-muted-foreground/70">
                          {sub.platform || "Web"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={twMerge(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest",
                        sub.isActive
                          ? "bg-emerald-500/10 text-emerald-600 shadow-sm shadow-emerald-500/10"
                          : "bg-orange-500/10 text-orange-600"
                      )}>
                        {sub.isActive ? <IconCheck className="h-3 w-3" stroke={3} /> : <IconX className="h-3 w-3" stroke={3} />}
                        {sub.isActive ? t("subscriptions.active") : t("subscriptions.inactive")}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-muted-foreground">
                          {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Lifetime"}
                        </span>
                        {sub.expiresAt && new Date(sub.expiresAt) < new Date() && (
                          <span className="text-[9px] font-black uppercase text-destructive tracking-widest">Expired</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => { }}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:bg-primary hover:border-primary hover:text-white shadow-sm"
                          title={t("userManagement.viewDetail")}
                        >
                          <IconExternalLink className="h-5 w-5" stroke={2} />
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

      {!loading && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => refresh(p)}
          total={pagination.total}
          limit={pagination.limit}
        />
      )}
    </div>
  );
}
