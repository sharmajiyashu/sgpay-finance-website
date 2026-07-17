"use client";

import * as React from "react";
import { useTranslations } from "@/contexts/LanguageContext";
import Link from "next/link";
import {
  IconShieldLock,
  IconUserShield,
  IconSettings,
  IconArrowRight,
  IconUsers,
  IconUserPlus,
  IconUserCheck,
  IconCreditCard,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import { getDashboardStats, type DashboardStats } from "@/lib/services/adminDashboardService";

export default function DashboardPage() {
  const { t } = useTranslations();
  const [data, setData] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getDashboardStats();
        setData(stats);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }
    void fetchStats();
  }, []);

  const stats = [
    {
      title: t("dashboard.card.totalUsers"),
      value: data?.totalUsers.value.toLocaleString() ?? "0",
      change: data?.newRegistrations.comparison
        ? `${data.newRegistrations.comparison >= 0 ? "+" : ""}${data.newRegistrations.comparison}%`
        : "0%",
      isPositive: (data?.newRegistrations.comparison ?? 0) >= 0,
      icon: IconUsers,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: t("dashboard.card.newRegistrations"),
      value: data?.newRegistrations.value.toLocaleString() ?? "0",
      change: data?.newRegistrations.comparison
        ? `${data.newRegistrations.comparison >= 0 ? "+" : ""}${data.newRegistrations.comparison}%`
        : "0%",
      isPositive: (data?.newRegistrations.comparison ?? 0) >= 0,
      icon: IconUserPlus,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: t("dashboard.card.activeUsers"),
      value: data?.activeUsers.value.toLocaleString() ?? "0",
      change: "",
      isPositive: true,
      icon: IconUserCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: t("dashboard.card.subscriptions"),
      value: data?.subscriptions.value.toLocaleString() ?? "0",
      change: data?.subscriptions.comparison
        ? `${data.subscriptions.comparison >= 0 ? "+" : ""}${data.subscriptions.comparison}%`
        : "0%",
      isPositive: (data?.subscriptions.comparison ?? 0) >= 0,
      icon: IconCreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t("dashboard.title")}
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/administration/roles"
            className={twMerge(
              "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20",
              "transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
          >
            <IconUserShield className="h-4.5 w-4.5" stroke={2} aria-hidden />
            {t("dashboard.manageRoles")}
            <IconArrowRight className="h-4 w-4 opacity-50" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Statistics">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className={twMerge("rounded-2xl p-3 transition-colors", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" stroke={2} aria-hidden />
              </div>
              <div className={twMerge(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.isPositive ? <IconTrendingUp className="h-3 w-3" /> : <IconTrendingDown className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-foreground">
                  {stat.value}
                </span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                {t("dashboard.card.fromLastMonth")}
              </p>
            </div>

            {/* Subtle decorative elements */}
            <div className={twMerge("absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-[0.03] transition-transform duration-500 group-hover:scale-150", stat.bg)} />
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-1">
        <section className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">
            {t("dashboard.quickActions")}
          </h2>
          <div className="mt-6">
            <Link
              href="/administration/roles"
              className={twMerge(
                "group flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4 transition-all hover:bg-muted hover:border-primary/20",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 rounded-xl bg-muted p-2.5 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <IconUserShield className="h-5 w-5" stroke={2} aria-hidden />
                </span>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    {t("dashboard.action.rolesTitle")}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground/80">
                    {t("dashboard.action.rolesDesc")}
                  </div>
                </div>
              </div>
              <IconArrowRight className="h-5 w-5 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" stroke={2} aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
