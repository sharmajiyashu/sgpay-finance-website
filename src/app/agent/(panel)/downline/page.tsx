"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { AGENT_API_PATHS } from "@/lib/config/env";
import {
  createDownlineAgent,
  getDownline,
} from "@/sg-agent/lib/services/downlineService";
import { Pagination } from "@/components/ui/Pagination";

const AGENT_TYPE_LABELS: Record<string, string> = {
  super_distributor: "Super Distributor",
  distributor: "Distributor",
  retailer: "Retailer",
};

export default function AgentDownlinePage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    address: "",
    panCard: "",
    agentType: "" as "" | "distributor" | "retailer",
    commissionPercent: "",
  });

  const params = new URLSearchParams({
    page: String(page),
    limit: "20",
  });
  if (searchQuery.trim()) params.set("search", searchQuery.trim());

  const { data, isLoading, error } = useQuery({
    queryKey: ["agent-downline", page, searchQuery],
    queryFn: () => getDownline(`${AGENT_API_PATHS.downline}?${params.toString()}`),
  });

  const agents = data?.agents || [];
  const pagination = data?.pagination;
  const canCreate = data?.canCreate || [];

  const createMutation = useMutation({
    mutationFn: () =>
      createDownlineAgent({
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        city: form.city || undefined,
        address: form.address || undefined,
        panCard: form.panCard || undefined,
        agentType: (form.agentType || canCreate[0]) as "distributor" | "retailer",
        commissionPercent: form.commissionPercent
          ? Number(form.commissionPercent)
          : null,
      }),
    onSuccess: () => {
      setShowCreate(false);
      setForm({
        fullName: "",
        email: "",
        mobile: "",
        city: "",
        address: "",
        panCard: "",
        agentType: "",
        commissionPercent: "",
      });
      queryClient.invalidateQueries({ queryKey: ["agent-downline"] });
      toast.success("Downline agent created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Downline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage agents under you
          </p>
        </div>
        {canCreate.length > 0 && (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <IconUserPlus className="h-4 w-4" />
            Add {(canCreate[0] && AGENT_TYPE_LABELS[canCreate[0]]) || "Agent"}
          </button>
        )}
      </div>

      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search downline..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm"
        />
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Create Downline Agent</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Field label="Full Name *" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} required />
            <Field label="Email *" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} required />
            <Field label="Mobile *" value={form.mobile} onChange={(v) => setForm((p) => ({ ...p, mobile: v }))} required />
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Type</label>
              <select
                value={form.agentType || canCreate[0] || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    agentType: e.target.value as "distributor" | "retailer",
                  }))
                }
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
              >
                {canCreate.map((t) => (
                  <option key={t} value={t}>
                    {AGENT_TYPE_LABELS[t] || t}
                  </option>
                ))}
              </select>
            </div>
            <Field label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
            <Field label="PAN" value={form.panCard} onChange={(v) => setForm((p) => ({ ...p, panCard: v.toUpperCase() }))} />
            <Field label="Commission % override" value={form.commissionPercent} onChange={(v) => setForm((p) => ({ ...p, commissionPercent: v }))} />
            <Field label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} className="sm:col-span-2" />
            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load downline"}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : agents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No downline agents yet
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent._id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium">
                    {[agent.firstName, agent.lastName].filter(Boolean).join(" ") ||
                      agent.email}
                  </td>
                  <td className="px-4 py-3">
                    {agent.agentType
                      ? AGENT_TYPE_LABELS[agent.agentType] || agent.agentType
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div>{agent.email}</div>
                    <div className="text-muted-foreground">{agent.mobile}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{agent.status || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
      />
    </div>
  );
}
