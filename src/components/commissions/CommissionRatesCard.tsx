"use client";

import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { formatCommissionRate } from "@/lib/choiceConnect/types";
import type { CommissionRatesResponse } from "@/sg-admin/lib/services/commissionService";

const HINTS: Record<string, string> = {
  "credit-card": "When a credit card is issued or approved",
  roar: "When a Roar Bank enquiry is completed",
  "motor-insurance": "When a motor policy is issued",
};

export function CommissionRatesCard({
  getRates,
  queryKey,
  highlight,
  title = "Your commission",
  description,
}: {
  getRates: () => Promise<CommissionRatesResponse>;
  queryKey: unknown[];
  highlight?: "credit-card" | "roar" | "motor-insurance";
  title?: string;
  description?: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: getRates,
    staleTime: 60 * 1000,
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {description ||
            (data?.roleLabel
              ? `As ${data.roleLabel}, this is what you earn on each product.`
              : "What you earn when a customer completes these products.")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load commission rates"}
        </p>
      ) : null}

      {data ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {data.products.map((product) => {
            const active = product.isActive;
            const amount = active ? formatCommissionRate(product) : "Not set";
            const focused = highlight === product.productType;
            return (
              <div
                key={product.productType}
                className={twMerge(
                  "rounded-xl border p-4",
                  focused
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background"
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {product.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">{amount}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {HINTS[product.productType] || "Paid after a successful sale"}
                </p>
                {product.source === "override" ? (
                  <p className="mt-2 text-[11px] font-medium text-primary">Custom rate</p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
