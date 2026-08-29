"use client";

import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ResponsiveRecordListProps {
  table: ReactNode;
  cards: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveRecordList({
  table,
  cards,
  isLoading = false,
  isEmpty = false,
  loadingMessage = "Loading…",
  emptyMessage = "No records found.",
  className,
}: ResponsiveRecordListProps) {
  if (isLoading) {
    return (
      <div
        className={twMerge(
          "rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-sm",
          className
        )}
      >
        {loadingMessage}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className={twMerge(
          "rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-sm",
          className
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={twMerge("min-w-0", className)}>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
        <div className="overflow-x-auto">{table}</div>
      </div>
      <div className="space-y-3 md:hidden">{cards}</div>
    </div>
  );
}

interface RecordCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RecordCard({ children, className, onClick }: RecordCardProps) {
  const classes = twMerge(
    "w-full min-w-0 rounded-xl border border-border bg-card p-4 text-left shadow-sm",
    onClick && "active:scale-[0.99]",
    className
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  return <article className={classes}>{children}</article>;
}

interface RecordCardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export function RecordCardHeader({ title, subtitle, badge, className }: RecordCardHeaderProps) {
  return (
    <div className={twMerge("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <div className="break-words font-medium text-foreground">{title}</div>
        {subtitle ? (
          <div className="mt-0.5 break-all text-xs text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
      {badge ? <div className="shrink-0">{badge}</div> : null}
    </div>
  );
}

interface RecordCardFieldProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function RecordCardField({ label, value, className }: RecordCardFieldProps) {
  return (
    <div className={twMerge("flex items-start justify-between gap-3 text-sm", className)}>
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

interface RecordCardFieldsProps {
  children: ReactNode;
  className?: string;
}

export function RecordCardFields({ children, className }: RecordCardFieldsProps) {
  return <dl className={twMerge("mt-3 space-y-2 border-t border-border/60 pt-3", className)}>{children}</dl>;
}

interface RecordCardActionsProps {
  children: ReactNode;
  className?: string;
}

export function RecordCardActions({ children, className }: RecordCardActionsProps) {
  return (
    <div className={twMerge("mt-3 flex flex-col gap-2 border-t border-border/60 pt-3 sm:flex-row", className)}>
      {children}
    </div>
  );
}
