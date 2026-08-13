"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconEye, IconEyeOff, IconRefresh, IconSearch, IconUserPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { listUrl, unwrapList } from "@/sg-admin/lib/paginated-list";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import {
  createAgent,
  getAgents,
  regenerateAgentPassword,
  updateAgentStatus,
} from "@/sg-admin/lib/services/agentService";
import type { Agent } from "@/sg-admin/lib/types/agent";
import { agentFullName } from "@/sg-admin/lib/types/agent";
import { AGENT_TYPE_LABELS } from "@/sg-admin/lib/types/hierarchy";
import { Pagination } from "@/components/ui/Pagination";
import { hasPermission } from "@/sg-admin/lib/permissions";
import { getAuthUser } from "@/sg-admin/lib/api";

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "super_distributor", label: "Super Distributor" },
  { value: "distributor", label: "Distributor" },
  { value: "retailer", label: "Retailer" },
];

export type AgentStatusFilter = "" | "pending" | "approved" | "rejected";

function creatableAgentTypes(): Array<"super_distributor" | "distributor" | "retailer"> {
  const user = getAuthUser();
  const designation = typeof user?.designation === "string" ? user.designation : "super_admin";
  if (designation === "super_admin" || !designation) {
    return ["super_distributor", "distributor", "retailer"];
  }
  if (["state_head", "asm", "r"].includes(designation)) {
    return ["super_distributor"];
  }
  return [];
}

const STATUS_TITLES: Record<string, string> = {
  "": "All Agents",
  pending: "Pending Agents",
  approved: "Approved Agents",
  rejected: "Rejected Agents",
};

interface AdminAgentsPanelProps {
  /** Empty string = show all statuses (default). */
  statusFilter?: AgentStatusFilter;
}

export function AdminAgentsPanel({ statusFilter = "" }: AdminAgentsPanelProps) {
  const queryClient = useQueryClient();
  const canCreate = hasPermission("admin:agent:create");
  const allowedTypes = creatableAgentTypes();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // Channel hierarchy: by default show all Super Distributor / Distributor / Retailer.
  const [typeFilter, setTypeFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    panCard: "",
    status: "approved" as "pending" | "approved" | "rejected",
    agentType: (allowedTypes[0] || "super_distributor") as
      | "super_distributor"
      | "distributor"
      | "retailer",
    commissionPercent: "",
  });

  const url = listUrl(ADMIN_API_PATHS.agents, page, searchQuery, 20, {
    status: statusFilter || undefined,
    agentType: typeFilter || undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-agents", page, searchQuery, statusFilter, typeFilter],
    queryFn: () => getAgents(url),
  });

  const { items: agents, pagination } = unwrapList<Agent>(
    data as Record<string, unknown> | undefined,
    "agents"
  );

  const createMutation = useMutation({
    mutationFn: () =>
      createAgent({
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        address: form.address || undefined,
        city: form.city || undefined,
        panCard: form.panCard || undefined,
        status: form.status,
        agentType: form.agentType,
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
        address: "",
        city: "",
        panCard: "",
        status: "approved",
        agentType: allowedTypes[0] || "super_distributor",
        commissionPercent: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Agent created and credentials emailed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" }) =>
      updateAgentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Agent status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const passwordMutation = useMutation({
    mutationFn: regenerateAgentPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      toast.success("New password generated and emailed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {STATUS_TITLES[statusFilter] || "Agents"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Channel agents: Super Distributor → Distributor → Retailer
          </p>
        </div>
        {canCreate && allowedTypes.length > 0 && (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md"
          >
            <IconUserPlus className="h-4 w-4" />
            Add Agent
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Create Agent</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Input label="Full Name *" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} required />
            <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} required />
            <Input label="Mobile *" value={form.mobile} onChange={(v) => setForm((p) => ({ ...p, mobile: v }))} required />
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Agent Type *</label>
              <select
                value={form.agentType}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    agentType: e.target.value as typeof form.agentType,
                  }))
                }
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
              >
                {allowedTypes.map((t) => (
                  <option key={t} value={t}>
                    {AGENT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <Input label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
            <Input label="PAN Card" value={form.panCard} onChange={(v) => setForm((p) => ({ ...p, panCard: v.toUpperCase() }))} />
            <Input label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} className="sm:col-span-2" />
            <Input
              label="Commission % override"
              value={form.commissionPercent}
              onChange={(v) => setForm((p) => ({ ...p, commissionPercent: v }))}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value as typeof form.status }))
                }
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {createMutation.isPending ? "Creating..." : "Create Agent"}
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
          {error instanceof Error ? error.message : "Failed to load agents"}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Agent</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Commission</th>
                <th className="px-4 py-3 font-medium">Password</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Loading agents...
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No agents found
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent._id} className="border-b border-border/50 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium">{agentFullName(agent)}</div>
                      <div className="text-xs text-muted-foreground">{agent.city || "—"}</div>
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
                    <td className="px-4 py-3">
                      {typeof agent.commissionPercent === "number"
                        ? `${agent.commissionPercent}%`
                        : "Default"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {visiblePasswords[agent._id]
                            ? agent.generatedPassword || "—"
                            : "••••••••"}
                        </code>
                        <button
                          type="button"
                          onClick={() =>
                            setVisiblePasswords((p) => ({
                              ...p,
                              [agent._id]: !p[agent._id],
                            }))
                          }
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {visiblePasswords[agent._id] ? (
                            <IconEyeOff className="h-4 w-4" />
                          ) : (
                            <IconEye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => passwordMutation.mutate(agent._id)}
                          className="text-muted-foreground hover:text-foreground"
                          title="Regenerate password"
                        >
                          <IconRefresh className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={agent.status ?? "pending"}
                        disabled={statusMutation.isPending}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: agent._id,
                            status: e.target.value as "pending" | "approved" | "rejected",
                          })
                        }
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
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

function Input({
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
