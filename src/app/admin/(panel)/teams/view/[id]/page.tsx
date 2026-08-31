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
import { getTeamDetail, updateTeamMember } from "@/sg-admin/lib/services/teamService";
import { TEAM_DESIGNATION_LABELS, teamFullName } from "@/sg-admin/lib/types/hierarchy";
import { createdByLabel, personLabel } from "@/sg-admin/lib/created-by";
import { designationLabel } from "@/sg-admin/lib/team-utils";
import { hasPermission } from "@/sg-admin/lib/permissions";

export default function AdminTeamDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const queryClient = useQueryClient();
  const canUpdate = hasPermission("admin:team:update");
  const [tab, setTab] = useState("overview");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-team-detail", id],
    queryFn: () => getTeamDetail(id),
    enabled: Boolean(id),
  });

  const member = data?.member;
  const isActive = member?.isActive !== false;

  const statusMutation = useMutation({
    mutationFn: (nextActive: boolean) => updateTeamMember(id, { isActive: nextActive }),
    onSuccess: (_, nextActive) => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      queryClient.invalidateQueries({ queryKey: ["admin-org-tree"] });
      toast.success(nextActive ? "Team member activated" : "Team member deactivated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <DetailPageShell
      backHref="/admin/teams"
      backLabel="Teams"
      title={member ? teamFullName(member) : "Team member"}
      subtitle={member ? `${member.email || "—"} · ${member.mobile || "—"}` : undefined}
      badges={
        member ? (
          <StatusBadge
            label={isActive ? "Active" : "Inactive"}
            tone={isActive ? "success" : "danger"}
          />
        ) : null
      }
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "tree", label: "Tree" },
      ]}
      activeTab={tab}
      onTabChange={setTab}
      isLoading={isLoading}
      error={error instanceof Error ? error.message : error ? "Failed to load team member" : null}
    >
      {member && tab === "overview" ? (
        <div className="space-y-6">
          <DetailSection title="Profile">
            <DetailInfoGrid>
              <DetailInfoCard
                label="Designation"
                value={
                  member.designation
                    ? TEAM_DESIGNATION_LABELS[member.designation as keyof typeof TEAM_DESIGNATION_LABELS] ||
                      designationLabel(member.designation)
                    : "—"
                }
              />
              <DetailInfoCard label="Created by" value={createdByLabel(member)} />
              <DetailInfoCard label="Reports to" value={personLabel(member.parentId)} />
              <DetailInfoCard
                label="Territory"
                value={`${member.stateCode || "—"} · ${member.territory || member.city || "—"}`}
              />
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
                    onboarded={member.choiceConnectProfile?.onboarded}
                    agentCode={member.choiceConnectProfile?.agentCode}
                  />
                }
              />
            </DetailInfoGrid>
          </DetailSection>

          {canUpdate ? (
            <ReviewActions
              title="Member status"
              description="Activate this member to keep them in the team, or deactivate to block access."
              approveLabel="Activate"
              rejectLabel="Deactivate"
              approveConfirm="Activate this team member so they can log in?"
              rejectConfirm="Deactivate this team member and block login?"
              pending={statusMutation.isPending}
              onApprove={() => statusMutation.mutate(true)}
              onReject={() => statusMutation.mutate(false)}
            />
          ) : null}
        </div>
      ) : null}

      {tab === "tree" ? (
        <DetailSection
          title="Create tree"
          description={`People this member created, and who those people created.${
            data?.stats ? ` Direct ${data.stats.directCount}, total ${data.stats.totalCount}.` : ""
          }`}
        >
          <CreateTree tree={data?.tree || []} />
        </DetailSection>
      ) : null}
    </DetailPageShell>
  );
}
