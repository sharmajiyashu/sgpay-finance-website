"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateTree } from "@/sg-admin/components/CreateTree";
import { ChoiceConnectStatusBadge } from "@/components/choice-connect/ChoiceConnectStatusBadge";
import {
  DetailInfoCard,
  DetailInfoGrid,
  DetailPageShell,
  DetailSection,
  StatusBadge,
} from "@/sg-admin/components/detail/DetailPageShell";
import { ReviewActions } from "@/sg-admin/components/detail/ReviewActions";
import {
  getAgentDetail,
  reviewAgentKyc,
  updateAgentStatus,
} from "@/sg-admin/lib/services/agentService";
import { agentFullName } from "@/sg-admin/lib/types/agent";
import { AGENT_TYPE_LABELS } from "@/sg-admin/lib/types/hierarchy";
import { createdByLabel, personLabel } from "@/sg-admin/lib/created-by";
import { kycBadgeClass, kycLabel } from "@/sg-admin/lib/kyc";
import { hasPermission } from "@/sg-admin/lib/permissions";
import { getCommissionRates } from "@/sg-admin/lib/services/commissionService";
import { CommissionRatesCard } from "@/components/commissions/CommissionRatesCard";
import { twMerge } from "tailwind-merge";

function initialsFromName(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "A";
}

function mediaUrl(file?: { url?: string } | string | null): string | null {
  if (!file) return null;
  if (typeof file === "string") return file;
  return file.url || null;
}

function accountTone(status?: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  if (status === "pending") return "warning";
  return "neutral";
}

export default function AdminAgentDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const queryClient = useQueryClient();
  const canUpdate = hasPermission("admin:agent:update");
  const [tab, setTab] = useState("overview");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-agent-detail", id],
    queryFn: () => getAgentDetail(id),
    enabled: Boolean(id),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-agent-detail", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    queryClient.invalidateQueries({ queryKey: ["sidebar-counts"] });
  };

  const statusMutation = useMutation({
    mutationFn: (status: "approved" | "rejected") =>
      updateAgentStatus(id, status, status === "approved"),
    onSuccess: (_, status) => {
      refresh();
      toast.success(status === "approved" ? "Agent approved" : "Agent rejected");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const kycMutation = useMutation({
    mutationFn: (body: { status: "approved" | "rejected"; note?: string }) =>
      reviewAgentKyc(id, body),
    onSuccess: (_, body) => {
      refresh();
      toast.success(body.status === "approved" ? "KYC approved" : "KYC rejected");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const agent = data?.agent;
  const accountStatus = agent?.status || "pending";

  return (
    <DetailPageShell
      backHref="/admin/agents"
      backLabel="Agents"
      title={agent ? agentFullName(agent) : "Agent"}
      subtitle={agent ? `${agent.email || "—"} · ${agent.mobile || "—"}` : undefined}
      initials={agent ? initialsFromName(agentFullName(agent)) : "A"}
      role={agent?.agentType ? AGENT_TYPE_LABELS[agent.agentType] : "Agent"}
      badges={
        agent ? (
          <>
            <StatusBadge
              label={accountStatus.charAt(0).toUpperCase() + accountStatus.slice(1)}
              tone={accountTone(accountStatus)}
            />
            <span
              className={twMerge(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                kycBadgeClass(agent.kycStatus)
              )}
            >
              KYC {kycLabel(agent.kycStatus)}
            </span>
          </>
        ) : null
      }
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "tree", label: "Tree" },
        { id: "kyc", label: "KYC" },
      ]}
      activeTab={tab}
      onTabChange={setTab}
      isLoading={isLoading}
      error={error instanceof Error ? error.message : error ? "Failed to load agent" : null}
    >
      {agent && tab === "overview" ? (
        <div className="space-y-6">
          <DetailSection title="Profile">
            <DetailInfoGrid>
              <DetailInfoCard
                label="Type"
                value={agent.agentType ? AGENT_TYPE_LABELS[agent.agentType] : "—"}
              />
              <DetailInfoCard label="Created by" value={createdByLabel(agent)} />
              <DetailInfoCard label="Reports to" value={personLabel(agent.parentId)} />
              <DetailInfoCard label="Managed by" value={personLabel(agent.managedById)} />
              <DetailInfoCard
                label="Created downline"
                value={
                  data?.stats ? `${data.stats.directCount} direct · ${data.stats.totalCount} total` : "—"
                }
              />
              <DetailInfoCard
                label="Choice Connect"
                value={
                  <ChoiceConnectStatusBadge
                    onboarded={agent.choiceConnectProfile?.onboarded}
                    agentCode={agent.choiceConnectProfile?.agentCode}
                  />
                }
              />
            </DetailInfoGrid>
          </DetailSection>

          <CommissionRatesCard
            getRates={() => getCommissionRates(id)}
            queryKey={["commission-rates", "agent", id]}
            title="Commission they earn"
            description="Payout for this agent’s role on Credit Card, Roar Bank, and Motor Vehicle."
          />

          {canUpdate ? (
            <ReviewActions
              title="Account approval"
              description="Approve to activate login, or reject to block this agent."
              approveLabel="Approve agent"
              rejectLabel="Reject agent"
              approveConfirm="This agent will be marked approved and can log in."
              rejectConfirm="This agent will be marked rejected and deactivated."
              pending={statusMutation.isPending}
              onApprove={() => statusMutation.mutate("approved")}
              onReject={() => statusMutation.mutate("rejected")}
            />
          ) : null}
        </div>
      ) : null}

      {tab === "tree" ? (
        <DetailSection
          title="Create tree"
          description={`People this agent created, and who those people created.${
            data?.stats ? ` Direct ${data.stats.directCount}, total ${data.stats.totalCount}.` : ""
          }`}
        >
          <CreateTree tree={data?.tree || []} />
        </DetailSection>
      ) : null}

      {agent && tab === "kyc" ? (
        <div className="space-y-6">
          <DetailSection title="KYC details">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={twMerge(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  kycBadgeClass(agent.kycStatus)
                )}
              >
                {kycLabel(agent.kycStatus)}
              </span>
              {agent.kycReviewedAt ? (
                <span className="text-xs text-muted-foreground">
                  Reviewed {new Date(agent.kycReviewedAt).toLocaleString()}
                </span>
              ) : null}
            </div>
            <DetailInfoGrid>
              <DetailInfoCard label="PAN" value={agent.panCard || "—"} />
              <DetailInfoCard label="Aadhaar" value={agent.aadhaarCardNumber || "—"} />
            </DetailInfoGrid>
            {agent.kycReviewNote ? (
              <p className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
                Note: {agent.kycReviewNote}
              </p>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <KycDoc title="PAN card" url={mediaUrl(agent.panCardFile)} />
              <KycDoc title="Aadhaar front" url={mediaUrl(agent.aadhaarFrontFile)} />
              <KycDoc title="Aadhaar back" url={mediaUrl(agent.aadhaarBackFile)} />
              <KycDoc title="Bank passbook" url={mediaUrl(agent.bankPassbookFile)} />
            </div>
          </DetailSection>

          {canUpdate ? (
            <ReviewActions
              title="KYC review"
              description="Approve after checking documents, or reject with a reason."
              approveLabel="Approve KYC"
              rejectLabel="Reject KYC"
              approveConfirm="Mark this agent's KYC as verified?"
              rejectConfirm="Reject this KYC. The agent will see the reason."
              rejectRequiresNote
              rejectNotePlaceholder="Why is this KYC being rejected?"
              pending={kycMutation.isPending}
              onApprove={() => kycMutation.mutate({ status: "approved" })}
              onReject={(note) => kycMutation.mutate({ status: "rejected", note })}
            />
          ) : null}
        </div>
      ) : null}
    </DetailPageShell>
  );
}

function KycDoc({ title, url }: { title: string; url: string | null }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="mt-2 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={title} className="max-h-56 w-full rounded-lg bg-muted object-contain" />
        </a>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Not uploaded</p>
      )}
    </div>
  );
}
