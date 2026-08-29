"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconEye, IconEyeOff, IconRefresh, IconSearch, IconUserPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
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
import { ChoiceConnectStatusBadge } from "@/components/choice-connect/ChoiceConnectStatusBadge";
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

const STATUS_OPTIONS: { value: AgentStatusFilter; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function AdminAgentsPanel() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading agents...</p>}>
      <AdminAgentsPanelInner />
    </Suspense>
  );
}

function readParam(params: URLSearchParams, key: string) {
  return params.get(key)?.trim() ?? "";
}

function AdminAgentsPanelInner() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const canCreate = hasPermission("admin:agent:create");
  const allowedTypes = creatableAgentTypes();
  const [page, setPage] = useState(() => {
    const next = Number(readParam(searchParams, "page"));
    return next > 0 ? next : 1;
  });
  const [searchQuery, setSearchQuery] = useState(() => readParam(searchParams, "search"));
  const [statusFilter, setStatusFilter] = useState<AgentStatusFilter>(() => {
    const raw = readParam(searchParams, "status");
    if (raw === "pending" || raw === "approved" || raw === "rejected") return raw;
    return "";
  });
  const [typeFilter, setTypeFilter] = useState(() => readParam(searchParams, "agentType"));
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

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDelete = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };
    setOrDelete("page", page > 1 ? String(page) : "");
    setOrDelete("search", searchQuery.trim());
    setOrDelete("status", statusFilter);
    setOrDelete("agentType", typeFilter);
    const next = params.toString();
    const current = searchParams.toString();
    if (next === current) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [page, searchQuery, statusFilter, typeFilter, pathname, router, searchParams]);

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
      queryClient.invalidateQueries({ queryKey: ["sidebar-counts"] });
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
      queryClient.invalidateQueries({ queryKey: ["sidebar-counts"] });
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
          <h1 className="text-2xl font-bold text-foreground">Agents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All statuses by default. Pending approvals are highlighted.
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
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as AgentStatusFilter);
            setPage(1);
          }}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm sm:w-auto"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm sm:w-auto"
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
                <th className="px-4 py-3 font-medium">Choice Connect</th>
                <th className="px-4 py-3 font-medium">Password</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading agents...
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No agents found
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr
                    key={agent._id}
                    className={twMerge(
                      "border-b border-border/50 align-top",
                      (agent.status ?? "pending") === "pending" &&
                        "bg-amber-50/90 ring-1 ring-inset ring-amber-200/80"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{agentFullName(agent)}</span>
                        {(agent.status ?? "pending") === "pending" && (
                          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-900">
                            Pending
                          </span>
                        )}
                      </div>
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
                      <ChoiceConnectStatusBadge
                        onboarded={agent.choiceConnectProfile?.onboarded}
                        agentCode={agent.choiceConnectProfile?.agentCode}
                      />
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
                        className={twMerge(
                          "rounded-lg border px-2 py-1 text-xs capitalize",
                          (agent.status ?? "pending") === "pending"
                            ? "border-amber-300 bg-amber-100 font-semibold text-amber-900"
                            : "border-border bg-background"
                        )}
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
