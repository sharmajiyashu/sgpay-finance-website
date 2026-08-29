"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCommissionRules,
  saveCommissionRules,
} from "@/sg-admin/lib/services/commissionService";
import { COMMISSION_LEVEL_LABELS } from "@/sg-admin/lib/types/hierarchy";
import { COMMISSION_PRODUCT_TYPES } from "@/lib/choiceConnect/types";
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

type RuleRow = { level: string; percent: number; isActive: boolean };

function emptyRows(): RuleRow[] {
  return ALL_LEVELS.map((level) => ({ level, percent: 0, isActive: true }));
}

function mergeRows(incoming: Array<{ level: string; percent: number; isActive?: boolean }>): RuleRow[] {
  const byLevel = new Map(incoming.map((r) => [r.level, r]));
  return ALL_LEVELS.map((level) => {
    const existing = byLevel.get(level);
    return {
      level,
      percent: existing?.percent ?? 0,
      isActive: existing?.isActive !== false,
    };
  });
}

export default function CommissionRulesPage() {
  const queryClient = useQueryClient();
  const canUpdate = hasPermission("admin:commission:update");
  const [productType, setProductType] = useState("credit-card");
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
    mutationFn: () => saveCommissionRules(rows, productType),
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
        percent: row?.isActive === false ? 0 : row?.percent ?? 0,
        isActive: row?.isActive !== false,
      };
    });
  }, [rows]);

  const totalPercent = cascade.reduce((sum, step) => sum + step.percent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commission Rules</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Default commission % by hierarchy level for each product. Each role in the sale
          upline earns its own % of the same base amount. Loan rules apply when a Choice
          Connect loan is disbursed or marked done.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {COMMISSION_PRODUCT_TYPES.map((product) => (
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
        <p className="text-sm font-medium text-foreground">Cascade preview</p>
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
                {step.label} {step.percent}%
              </span>
              {index < cascade.length - 1 && (
                <span className="text-xs text-muted-foreground">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-foreground">
          Total of role rules: <strong>{totalPercent.toFixed(1)}%</strong> of base
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
                <th className="px-4 py-3 font-medium">Percent (%)</th>
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
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      disabled={!canUpdate}
                      value={row.percent}
                      onChange={(e) => {
                        const percent = Number(e.target.value);
                        setRows((prev) =>
                          prev.map((r, i) => (i === index ? { ...r, percent } : r))
                        );
                      }}
                      className="w-28 rounded-lg border border-border bg-background px-3 py-2"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      disabled={!canUpdate}
                      checked={row.isActive}
                      onChange={(e) => {
                        const isActive = e.target.checked;
                        setRows((prev) =>
                          prev.map((r, i) => (i === index ? { ...r, isActive } : r))
                        );
                      }}
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
                label="Percent (%)"
                value={
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    disabled={!canUpdate}
                    value={row.percent}
                    onChange={(e) => {
                      const percent = Number(e.target.value);
                      setRows((prev) =>
                        prev.map((r, i) => (i === index ? { ...r, percent } : r))
                      );
                    }}
                    className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-right"
                  />
                }
              />
              <RecordCardField
                label="Active"
                value={
                  <input
                    type="checkbox"
                    disabled={!canUpdate}
                    checked={row.isActive}
                    onChange={(e) => {
                      const isActive = e.target.checked;
                      setRows((prev) =>
                        prev.map((r, i) => (i === index ? { ...r, isActive } : r))
                      );
                    }}
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
