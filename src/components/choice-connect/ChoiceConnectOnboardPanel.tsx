"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconUserPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import type { ChoiceOnboardInput } from "@/lib/choiceConnect/types";
import { getAgents } from "@/sg-admin/lib/services/agentService";
import { getTeams } from "@/sg-admin/lib/services/teamService";
import { agentFullName, type Agent } from "@/sg-admin/lib/types/agent";
import {
  TEAM_DESIGNATION_LABELS,
  teamFullName,
  type TeamMember,
} from "@/sg-admin/lib/types/hierarchy";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import { ChoiceConnectStatusBadge } from "@/components/choice-connect/ChoiceConnectStatusBadge";

export interface ChoiceConnectOnboardApiClient {
  onboardAgent: (input: ChoiceOnboardInput) => Promise<{
    choiceSubjectId?: string;
    oprId: string;
  }>;
}

interface ChoiceConnectOnboardPanelProps {
  api: ChoiceConnectOnboardApiClient;
  defaultOprId?: string;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

export function ChoiceConnectOnboardPanel({
  api,
  defaultOprId = "",
}: ChoiceConnectOnboardPanelProps) {
  const queryClient = useQueryClient();
  const [userType, setUserType] = useState<"agent" | "team">("agent");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    panCard: "",
    oprId: defaultOprId,
    referralCode: "",
    city: "",
    agentCode: "",
  });

  const { data: agentsData, isLoading: agentsLoading } = useQuery({
    queryKey: ["admin-agents-onboard"],
    queryFn: () => getAgents(`${ADMIN_API_PATHS.agents}?limit=200&status=approved`),
  });

  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["admin-teams-onboard"],
    queryFn: () => getTeams(`${ADMIN_API_PATHS.teams}?limit=200`),
  });

  const agents = agentsData?.agents ?? [];
  const teams = teamsData?.teams ?? [];
  const selectedAgent = agents.find((a) => a._id === selectedUserId);
  const selectedTeam = teams.find((t) => t._id === selectedUserId);
  const selectedProfile =
    userType === "agent"
      ? selectedAgent?.choiceConnectProfile
      : selectedTeam?.choiceConnectProfile;

  useEffect(() => {
    if (!selectedUserId) return;
    if (userType === "agent") {
      if (!selectedAgent) return;
      setForm((prev) => ({
        ...prev,
        firstName: selectedAgent.firstName || splitFullName(agentFullName(selectedAgent)).firstName,
        lastName: selectedAgent.lastName || splitFullName(agentFullName(selectedAgent)).lastName,
        email: selectedAgent.email || "",
        mobile: selectedAgent.mobile || "",
        panCard: selectedAgent.panCard || "",
        city: selectedAgent.city || "",
        agentCode: selectedAgent.choiceConnectProfile?.agentCode || prev.agentCode,
      }));
      return;
    }
    if (!selectedTeam) return;
    setForm((prev) => ({
      ...prev,
      firstName: selectedTeam.firstName || splitFullName(teamFullName(selectedTeam)).firstName,
      lastName: selectedTeam.lastName || splitFullName(teamFullName(selectedTeam)).lastName,
      email: selectedTeam.email || "",
      mobile: selectedTeam.mobile || "",
      city: selectedTeam.city || "",
      agentCode: selectedTeam.choiceConnectProfile?.agentCode || prev.agentCode,
    }));
  }, [selectedUserId, selectedAgent, selectedTeam, userType]);

  const mutation = useMutation({
    mutationFn: () =>
      api.onboardAgent({
        userId: selectedUserId || undefined,
        userType,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim() || undefined,
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        panCard: form.panCard.trim() || undefined,
        oprId: form.oprId.trim(),
        referralCode: form.referralCode.trim() || undefined,
        city: form.city.trim() || undefined,
        agentCode: form.agentCode.trim() || undefined,
      }),
    onSuccess: (result) => {
      toast.success(
        userType === "team"
          ? "Team member onboarded to Choice Connect"
          : "Agent onboarded to Choice Connect successfully"
      );
      if (result.choiceSubjectId) {
        toast.message(`Choice subject ID: ${result.choiceSubjectId}`);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-agents-onboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-teams-onboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Onboarding failed");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.mobile.trim() || !form.oprId.trim()) {
      toast.error("First name, email, mobile, and OPR ID are required");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Choice Connect Onboarding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register agents and team members with Choice Connect so their name appears as the
          referrer on partner APIs, referral links, and loan or credit-card applications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">User type</label>
            <select
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value as "agent" | "team");
                setSelectedUserId("");
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="agent">Agent</option>
              <option value="team">Team member (SH / ASM / RM)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Link to existing {userType === "team" ? "team member" : "agent"} (optional)
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={userType === "agent" ? agentsLoading : teamsLoading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">— Select to pre-fill —</option>
              {userType === "agent"
                ? agents.map((agent: Agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agentFullName(agent)} ({agent.email})
                      {agent.choiceConnectProfile?.onboarded ? " · onboarded" : ""}
                    </option>
                  ))
                : teams.map((member: TeamMember) => (
                    <option key={member._id} value={member._id}>
                      {teamFullName(member)} ({member.email})
                      {member.designation
                        ? ` · ${TEAM_DESIGNATION_LABELS[member.designation as keyof typeof TEAM_DESIGNATION_LABELS] || member.designation}`
                        : ""}
                      {member.choiceConnectProfile?.onboarded ? " · onboarded" : ""}
                    </option>
                  ))}
            </select>
          </div>

          {selectedUserId && (
            <div className="md:col-span-2">
              <ChoiceConnectStatusBadge
                onboarded={selectedProfile?.onboarded}
                agentCode={selectedProfile?.agentCode}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">First Name *</label>
            <input
              required
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Last Name</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Mobile *</label>
            <input
              required
              value={form.mobile}
              onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">PAN</label>
            <input
              value={form.panCard}
              onChange={(e) => setForm((f) => ({ ...f, panCard: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City / Pincode</label>
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="302033"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">OPR ID *</label>
            <input
              required
              value={form.oprId}
              onChange={(e) => setForm((f) => ({ ...f, oprId: e.target.value }))}
              placeholder="Choice Connect subject / OPR ID"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Referral Code</label>
            <input
              value={form.referralCode}
              onChange={(e) => setForm((f) => ({ ...f, referralCode: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Agent Code (CBA)</label>
            <input
              value={form.agentCode}
              onChange={(e) => setForm((f) => ({ ...f, agentCode: e.target.value }))}
              placeholder="Saved to profile on success"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          <IconUserPlus className="h-4 w-4" />
          {mutation.isPending ? "Onboarding…" : "Onboard to Choice Connect"}
        </button>
      </form>
    </div>
  );
}
