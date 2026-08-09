"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCommissionRules,
  saveCommissionRules,
} from "@/sg-admin/lib/services/commissionService";
import { COMMISSION_LEVEL_LABELS } from "@/sg-admin/lib/types/hierarchy";
import { hasPermission } from "@/sg-admin/lib/permissions";

export default function CommissionRulesPage() {
  const queryClient = useQueryClient();
  const canUpdate = hasPermission("admin:commission:update");
  const [rows, setRows] = useState<Array<{ level: string; percent: number; isActive: boolean }>>(
    []
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["commission-rules", "credit-card"],
    queryFn: () => getCommissionRules("credit-card"),
  });

  useEffect(() => {
    if (data?.rules) {
      setRows(
        data.rules.map((r) => ({
          level: r.level,
          percent: r.percent,
          isActive: r.isActive !== false,
        }))
      );
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => saveCommissionRules(rows, "credit-card"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-rules"] });
      toast.success("Commission rules saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commission Rules</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Default credit-card commission % by hierarchy level
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load rules"}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Percent (%)</th>
              <th className="px-4 py-3 font-medium">Active</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  No rules found. Run backend seeders.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {canUpdate && (
        <button
          type="button"
          disabled={saveMutation.isPending || rows.length === 0}
          onClick={() => saveMutation.mutate()}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {saveMutation.isPending ? "Saving..." : "Save Rules"}
        </button>
      )}
    </div>
  );
}
