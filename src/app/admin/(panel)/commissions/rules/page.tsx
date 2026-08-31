"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCommissionRules,
  saveCommissionRules,
  type CommissionPayoutType,
  type CommissionRule,
} from "@/sg-admin/lib/services/commissionService";
import { COMMISSION_LEVEL_LABELS } from "@/sg-admin/lib/types/hierarchy";
import { COMMISSION_RULE_PRODUCTS } from "@/lib/choiceConnect/types";
import { hasPermission } from "@/sg-admin/lib/permissions";
import {
  RecordCard,
  RecordCardField,
  RecordCardFields,
  RecordCardHeader,
  ResponsiveRecordList,
} from "@/components/ui/ResponsiveRecordList";

const ALL_LEVELS = [
  "state_head",
  "asm",
  "rm",
  "super_distributor",
  "distributor",
  "retailer",
] as const;

const CASCADE_ORDER = [
  "retailer",
  "distributor",
  "super_distributor",
  "rm",
  "asm",
  "state_head",
] as const;

type RuleRow = {
  level: string;
  payoutType: CommissionPayoutType;
  percent: number;
  flatAmount: number;
  isActive: boolean;
};

function emptyRows(): RuleRow[] {
  return ALL_LEVELS.map((level) => ({
    level,
    payoutType: "percent",
    percent: 0,
    flatAmount: 0,
    isActive: true,
  }));
}

function resolvePayoutType(rule: CommissionRule): CommissionPayoutType {
  if (rule.payoutType === "flat" || rule.payoutType === "percent") return rule.payoutType;
  if ((rule.flatAmount || 0) > 0 && !(rule.percent > 0)) return "flat";
  return "percent";
}

function mergeRows(incoming: CommissionRule[]): RuleRow[] {
  const byLevel = new Map(incoming.map((r) => [r.level, r]));
  return ALL_LEVELS.map((level) => {
    const existing = byLevel.get(level);
    return {
      level,
      payoutType: existing ? resolvePayoutType(existing) : "percent",
      percent: existing?.percent ?? 0,
      flatAmount: existing?.flatAmount ?? 0,
      isActive: existing?.isActive !== false,
    };
  });
}

function formatPayout(row: Pick<RuleRow, "payoutType" | "percent" | "flatAmount" | "isActive">) {
  if (row.isActive === false) return "Off";
  if (row.payoutType === "flat") {
    return `₹${Number(row.flatAmount || 0).toLocaleString("en-IN")}`;
  }
  return `${Number(row.percent || 0)}%`;
}

export default function CommissionRulesPage() {
  const queryClient = useQueryClient();
  const canUpdate = hasPermission("admin:commission:update");
  const [productType, setProductType] = useState<(typeof COMMISSION_RULE_PRODUCTS)[number]["value"]>(
    "credit-card"
  );
  const [rows, setRows] = useState<RuleRow[]>(emptyRows);

  const { data, isLoading, error } = useQuery({
    queryKey: ["commission-rules", productType],
    queryFn: () => getCommissionRules(productType),
  });

  useEffect(() => {
    if (data?.rules) {
      setRows(mergeRows(data.rules));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => {
      for (const row of rows) {
        if (!row.isActive) continue;
        if (row.payoutType === "percent" && (row.percent < 0 || row.percent > 100)) {
          throw new Error(`${COMMISSION_LEVEL_LABELS[row.level] || row.level}: percent must be 0–100`);
        }
        if (row.payoutType === "flat" && row.flatAmount < 0) {
          throw new Error(`${COMMISSION_LEVEL_LABELS[row.level] || row.level}: flat amount cannot be negative`);
        }
      }
      return saveCommissionRules(rows, productType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-rules"] });
      toast.success("Commission rules saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cascade = useMemo(() => {
    const byLevel = new Map(rows.map((r) => [r.level, r]));
    return CASCADE_ORDER.map((level) => {
      const row = byLevel.get(level);
      return {
        level,
        label: COMMISSION_LEVEL_LABELS[level] || level,
        payout: row
          ? formatPayout(row)
          : "0%",
        isActive: row?.isActive !== false,
      };
    });
  }, [rows]);

  const totals = useMemo(() => {
    const active = rows.filter((row) => row.isActive);
    const percentTotal = active
      .filter((row) => row.payoutType === "percent")
      .reduce((sum, row) => sum + (Number(row.percent) || 0), 0);
    const flatTotal = active
      .filter((row) => row.payoutType === "flat")
      .reduce((sum, row) => sum + (Number(row.flatAmount) || 0), 0);
    return { percentTotal, flatTotal };
  }, [rows]);

  const selectedProduct =
    COMMISSION_RULE_PRODUCTS.find((product) => product.value === productType)?.label ||
    productType;

  const updateRow = (index: number, patch: Partial<RuleRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commission Rules</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set commission for <strong>Credit Card</strong>, <strong>Roar Bank</strong>, and{" "}
          <strong>Motor Vehicle</strong> only. Each role can earn a <strong>%</strong> of the
          sale or a <strong>flat ₹</strong> amount.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {COMMISSION_RULE_PRODUCTS.map((product) => (
          <button
            key={product.value}
            type="button"
            onClick={() => {
              setProductType(product.value);
              setRows(emptyRows());
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              productType === product.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card hover:bg-muted"
            }`}
          >
            {product.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load rules"}
        </p>
      )}

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-medium text-foreground">{selectedProduct} cascade</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sale starts at the retailer and walks up to State Head
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {cascade.map((step, index) => (
            <div key={step.level} className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  step.isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground line-through"
                }`}
              >
                {step.label} {step.payout}
              </span>
              {index < cascade.length - 1 && (
                <span className="text-xs text-muted-foreground">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-foreground">
          Active total:{" "}
          <strong>
            {totals.percentTotal.toFixed(1)}%
            {totals.flatTotal > 0
              ? ` + ₹${totals.flatTotal.toLocaleString("en-IN")}`
              : ""}
          </strong>
        </p>
      </div>

      <ResponsiveRecordList
        isLoading={isLoading}
        loadingMessage="Loading..."
        table={
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Active</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.level} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium">
                    {COMMISSION_LEVEL_LABELS[row.level] || row.level}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      disabled={!canUpdate}
                      value={row.payoutType}
                      onChange={(e) =>
                        updateRow(index, {
                          payoutType: e.target.value as CommissionPayoutType,
                        })
                      }
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat (₹)</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {row.payoutType === "flat" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">₹</span>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          disabled={!canUpdate}
                          value={row.flatAmount}
                          onChange={(e) =>
                            updateRow(index, { flatAmount: Number(e.target.value) })
                          }
                          className="w-32 rounded-lg border border-border bg-background px-3 py-2"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={0.1}
                          disabled={!canUpdate}
                          value={row.percent}
                          onChange={(e) =>
                            updateRow(index, { percent: Number(e.target.value) })
                          }
                          className="w-28 rounded-lg border border-border bg-background px-3 py-2"
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      disabled={!canUpdate}
                      checked={row.isActive}
                      onChange={(e) => updateRow(index, { isActive: e.target.checked })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        cards={rows.map((row, index) => (
          <RecordCard key={row.level}>
            <RecordCardHeader title={COMMISSION_LEVEL_LABELS[row.level] || row.level} />
            <RecordCardFields>
              <RecordCardField
                label="Type"
                value={
                  <select
                    disabled={!canUpdate}
                    value={row.payoutType}
                    onChange={(e) =>
                      updateRow(index, {
                        payoutType: e.target.value as CommissionPayoutType,
                      })
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                }
              />
              <RecordCardField
                label={row.payoutType === "flat" ? "Amount (₹)" : "Percent (%)"}
                value={
                  row.payoutType === "flat" ? (
                    <input
                      type="number"
                      min={0}
                      step={1}
                      disabled={!canUpdate}
                      value={row.flatAmount}
                      onChange={(e) =>
                        updateRow(index, { flatAmount: Number(e.target.value) })
                      }
                      className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-right"
                    />
                  ) : (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      disabled={!canUpdate}
                      value={row.percent}
                      onChange={(e) =>
                        updateRow(index, { percent: Number(e.target.value) })
                      }
                      className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-right"
                    />
                  )
                }
              />
              <RecordCardField
                label="Active"
                value={
                  <input
                    type="checkbox"
                    disabled={!canUpdate}
                    checked={row.isActive}
                    onChange={(e) => updateRow(index, { isActive: e.target.checked })}
                  />
                }
              />
            </RecordCardFields>
          </RecordCard>
        ))}
      />

      {canUpdate && (
        <button
          type="button"
          disabled={saveMutation.isPending || isLoading}
          onClick={() => saveMutation.mutate()}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground sm:w-auto"
        >
          {saveMutation.isPending ? "Saving..." : "Save Rules"}
        </button>
      )}
    </div>
  );
}
