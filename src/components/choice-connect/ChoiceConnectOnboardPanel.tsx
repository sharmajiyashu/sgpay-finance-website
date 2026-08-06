"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IconUserPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import type { ChoiceOnboardInput } from "@/lib/choiceConnect/types";
import { getAgents } from "@/sg-admin/lib/services/agentService";
import { agentFullName, type Agent } from "@/sg-admin/lib/types/agent";
import { ADMIN_API_PATHS } from "@/lib/config/env";

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
  const [selectedAgentId, setSelectedAgentId] = useState("");
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

  useEffect(() => {
    if (!selectedAgentId || !agentsData?.agents) return;
    const agent = agentsData.agents.find((a) => a._id === selectedAgentId);
    if (!agent) return;

    setForm((prev) => ({
      ...prev,
      firstName: agent.firstName || splitFullName(agentFullName(agent)).firstName,
      lastName: agent.lastName || splitFullName(agentFullName(agent)).lastName,
      email: agent.email || "",
      mobile: agent.mobile || "",
      panCard: agent.panCard || "",
      city: agent.city || "",
    }));
  }, [selectedAgentId, agentsData]);

  const mutation = useMutation({
    mutationFn: () =>
      api.onboardAgent({
        userId: selectedAgentId || undefined,
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
      toast.success("Agent onboarded to Choice Connect successfully");
      if (result.choiceSubjectId) {
        toast.message(`Choice subject ID: ${result.choiceSubjectId}`);
      }
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
        <h1 className="text-2xl font-semibold text-foreground">Agent Onboarding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register agents with Choice Connect so they can apply for credit cards and loans on behalf
          of customers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Link to existing agent (optional)</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              disabled={agentsLoading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">— Select agent to pre-fill —</option>
              {(agentsData?.agents ?? []).map((agent: Agent) => (
                <option key={agent._id} value={agent._id}>
                  {agentFullName(agent)} ({agent.email})
                </option>
              ))}
            </select>
          </div>

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
              placeholder="Saved to agent profile on success"
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
