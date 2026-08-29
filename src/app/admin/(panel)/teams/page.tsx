"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconEye, IconEyeOff, IconRefresh, IconSearch, IconUserPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { listUrl, unwrapList } from "@/sg-admin/lib/paginated-list";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import {
  createTeamMember,
  getTeamTree,
  getTeams,
  regenerateTeamPassword,
  updateTeamMember,
} from "@/sg-admin/lib/services/teamService";
import {
  TEAM_DESIGNATION_LABELS,
  teamFullName,
  type TeamMember,
  type TeamTreeNode,
} from "@/sg-admin/lib/types/hierarchy";
import { Pagination } from "@/components/ui/Pagination";
import {
  RecordCard,
  RecordCardField,
  RecordCardFields,
  RecordCardHeader,
  ResponsiveRecordList,
} from "@/components/ui/ResponsiveRecordList";
import { ChoiceConnectStatusBadge } from "@/components/choice-connect/ChoiceConnectStatusBadge";
import { hasPermission } from "@/sg-admin/lib/permissions";
import { getAuthUser } from "@/sg-admin/lib/api";

const DESIGNATION_OPTIONS = [
  { value: "", label: "All designations" },
  { value: "state_head", label: "State Head (SH)" },
  { value: "asm", label: "Sales Manager (ASM)" },
  { value: "rm", label: "Relationship Manager (RM)" },
];

function creatableDesignations(): Array<"state_head" | "asm" | "rm"> {
  const user = getAuthUser();
  const designation = typeof user?.designation === "string" ? user.designation : "super_admin";
  if (designation === "super_admin" || !designation) return ["state_head", "asm", "rm"];
  if (designation === "state_head") return ["asm"];
  if (designation === "asm") return ["rm"];
  return [];
}

function TreeNodes({ nodes, depth = 0 }: { nodes: TeamTreeNode[]; depth?: number }) {
  if (!nodes?.length) return null;
  return (
    <ul className={depth === 0 ? "space-y-2" : `mt-2 space-y-2 border-l border-border ${depth < 4 ? "pl-3" : "pl-2"}`}>
      {nodes.map((node) => (
        <li key={node._id || node.id}>
          <div className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-medium">{teamFullName(node)}</div>
              <ChoiceConnectStatusBadge
                onboarded={node.choiceConnectProfile?.onboarded}
                agentCode={node.choiceConnectProfile?.agentCode}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {node.designation
                ? TEAM_DESIGNATION_LABELS[node.designation as keyof typeof TEAM_DESIGNATION_LABELS] ||
                  node.designation
                : "—"}
              {node.stateCode ? ` · ${node.stateCode}` : ""}
              {node.email ? ` · ${node.email}` : ""}
            </div>
          </div>
          {node.children && node.children.length > 0 && (
            <TreeNodes nodes={node.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function AdminTeamsPage() {
  const queryClient = useQueryClient();
  const canCreate = hasPermission("admin:team:create");
  const allowedDesignations = creatableDesignations();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    designation: (allowedDesignations[0] || "state_head") as "state_head" | "asm" | "rm",
    stateCode: "",
    territory: "",
    address: "",
    city: "",
    panCard: "",
  });

  const url = listUrl(ADMIN_API_PATHS.teams, page, searchQuery, 20, {
    designation: designationFilter || undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-teams", page, searchQuery, designationFilter],
    queryFn: () => getTeams(url),
  });

  const { data: treeData } = useQuery({
    queryKey: ["admin-teams-tree"],
    queryFn: getTeamTree,
  });

  const { items: teams, pagination } = unwrapList<TeamMember>(
    data as Record<string, unknown> | undefined,
    "teams"
  );

  const createMutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      setShowCreate(false);
      setForm({
        fullName: "",
        email: "",
        mobile: "",
        designation: allowedDesignations[0] || "state_head",
        stateCode: "",
        territory: "",
        address: "",
        city: "",
        panCard: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      queryClient.invalidateQueries({ queryKey: ["admin-teams-tree"] });
      toast.success("Team member created and credentials emailed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateTeamMember(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      queryClient.invalidateQueries({ queryKey: ["admin-teams-tree"] });
      toast.success("Team member updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const passwordMutation = useMutation({
    mutationFn: regenerateTeamPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      toast.success("New password generated and emailed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teams</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Company hierarchy: State Head → ASM → R
          </p>
        </div>
        {canCreate && allowedDesignations.length > 0 && (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md"
          >
            <IconUserPlus className="h-4 w-4" />
            Add Team Member
          </button>
        )}
      </div>

      {treeData?.tree && treeData.tree.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Organization tree</h2>
          <div className="overflow-x-auto">
            <TreeNodes nodes={treeData.tree} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <select
          value={designationFilter}
          onChange={(e) => {
            setDesignationFilter(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm sm:w-auto"
        >
          {DESIGNATION_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Create Team Member</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate(form);
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Input label="Full Name *" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} required />
            <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} required />
            <Input label="Mobile *" value={form.mobile} onChange={(v) => setForm((p) => ({ ...p, mobile: v }))} required />
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Designation *</label>
              <select
                value={form.designation}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    designation: e.target.value as typeof form.designation,
                  }))
                }
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
              >
                {allowedDesignations.map((d) => (
                  <option key={d} value={d}>
                    {TEAM_DESIGNATION_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>
            <Input label="State Code" value={form.stateCode} onChange={(v) => setForm((p) => ({ ...p, stateCode: v.toUpperCase() }))} />
            <Input label="Territory" value={form.territory} onChange={(v) => setForm((p) => ({ ...p, territory: v }))} />
            <Input label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
            <Input label="PAN Card" value={form.panCard} onChange={(v) => setForm((p) => ({ ...p, panCard: v.toUpperCase() }))} />
            <Input label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} className="sm:col-span-2" />
            <div className="flex gap-3 sm:col-span-2">
              <button type="submit" disabled={createMutation.isPending} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                {createMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load teams"}
        </p>
      )}

      <ResponsiveRecordList
        isLoading={isLoading}
        isEmpty={!isLoading && teams.length === 0}
        loadingMessage="Loading teams..."
        emptyMessage="No team members found"
        table={
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Designation</th>
                <th className="px-4 py-3 font-medium">Territory</th>
                <th className="px-4 py-3 font-medium">Choice Connect</th>
                <th className="px-4 py-3 font-medium">Password</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((member) => (
                <tr key={member._id} className="border-b border-border/50 align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{teamFullName(member)}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                    <div className="text-xs text-muted-foreground">{member.mobile}</div>
                  </td>
                  <td className="px-4 py-3">
                    {member.designation
                      ? TEAM_DESIGNATION_LABELS[
                          member.designation as keyof typeof TEAM_DESIGNATION_LABELS
                        ] || member.designation
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div>{member.stateCode || "—"}</div>
                    <div className="text-xs text-muted-foreground">{member.territory || member.city || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <ChoiceConnectStatusBadge
                      onboarded={member.choiceConnectProfile?.onboarded}
                      agentCode={member.choiceConnectProfile?.agentCode}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-xs">
                        {visiblePasswords[member._id]
                          ? member.generatedPassword || "—"
                          : "••••••••"}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          setVisiblePasswords((p) => ({
                            ...p,
                            [member._id]: !p[member._id],
                          }))
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {visiblePasswords[member._id] ? (
                          <IconEyeOff className="h-4 w-4" />
                        ) : (
                          <IconEye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => passwordMutation.mutate(member._id)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Regenerate password"
                      >
                        <IconRefresh className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={member.isActive === false ? "false" : "true"}
                      disabled={statusMutation.isPending}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: member._id,
                          isActive: e.target.value === "true",
                        })
                      }
                      className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        cards={teams.map((member) => (
          <RecordCard key={member._id}>
            <RecordCardHeader
              title={teamFullName(member)}
              subtitle={`${member.email} · ${member.mobile}`}
            />
            <RecordCardFields>
              <RecordCardField
                label="Designation"
                value={
                  member.designation
                    ? TEAM_DESIGNATION_LABELS[
                        member.designation as keyof typeof TEAM_DESIGNATION_LABELS
                      ] || member.designation
                    : "—"
                }
              />
              <RecordCardField
                label="Territory"
                value={`${member.stateCode || "—"} · ${member.territory || member.city || "—"}`}
              />
              <RecordCardField
                label="Choice Connect"
                value={
                  <ChoiceConnectStatusBadge
                    onboarded={member.choiceConnectProfile?.onboarded}
                    agentCode={member.choiceConnectProfile?.agentCode}
                  />
                }
              />
              <RecordCardField
                label="Password"
                value={
                  <span className="inline-flex items-center gap-2">
                    <code className="rounded bg-muted px-2 py-1 text-xs">
                      {visiblePasswords[member._id]
                        ? member.generatedPassword || "—"
                        : "••••••••"}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        setVisiblePasswords((p) => ({
                          ...p,
                          [member._id]: !p[member._id],
                        }))
                      }
                    >
                      {visiblePasswords[member._id] ? (
                        <IconEyeOff className="h-4 w-4" />
                      ) : (
                        <IconEye className="h-4 w-4" />
                      )}
                    </button>
                    <button type="button" onClick={() => passwordMutation.mutate(member._id)}>
                      <IconRefresh className="h-4 w-4" />
                    </button>
                  </span>
                }
              />
              <RecordCardField
                label="Joined"
                value={member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "—"}
              />
            </RecordCardFields>
            <select
              value={member.isActive === false ? "false" : "true"}
              disabled={statusMutation.isPending}
              onChange={(e) =>
                statusMutation.mutate({
                  id: member._id,
                  isActive: e.target.value === "true",
                })
              }
              className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </RecordCard>
        ))}
      />

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
