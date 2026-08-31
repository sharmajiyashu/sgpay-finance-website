"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export interface DetailTab {
  id: string;
  label: string;
}

export function DetailPageShell({
  backHref,
  backLabel,
  title,
  subtitle,
  badges,
  initials,
  role,
  tabs,
  activeTab,
  onTabChange,
  isLoading,
  error,
  children,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  initials?: string;
  role?: string;
  tabs: DetailTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-emerald-500/8" />
        <div className="relative">
          <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
            ← {backLabel}
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {initials ? (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-md">
                  {initials}
                </div>
              ) : null}
              <div className="min-w-0">
                {role ? (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {role}
                  </p>
                ) : null}
                <h1 className="truncate text-2xl font-bold text-foreground">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
              </div>
            </div>
            {badges ? <div className="flex flex-wrap items-center gap-2">{badges}</div> : null}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap gap-1 border-b border-border bg-muted/30 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={twMerge(
                "rounded-xl px-4 py-2 text-sm font-medium capitalize",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {!isLoading && !error ? children : null}
        </div>
      </div>
    </div>
  );
}

export function DetailSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={twMerge("space-y-4", className)}>
      {title || description ? (
        <div>
          {title ? <h2 className="text-base font-semibold text-foreground">{title}</h2> : null}
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function DetailInfoGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function DetailInfoCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const tones = {
    success: "bg-emerald-500/10 text-emerald-700",
    warning: "bg-amber-500/10 text-amber-800",
    danger: "bg-rose-500/10 text-rose-700",
    info: "bg-sky-500/10 text-sky-700",
    neutral: "bg-muted text-muted-foreground",
  };
  return (
    <span className={twMerge("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {label}
    </span>
  );
}
