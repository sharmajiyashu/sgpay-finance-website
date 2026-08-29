"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAgentProfile,
  profileImageUrl,
  updateAgentProfile,
  uploadAgentProfileImage,
  type AgentProfile,
} from "@/sg-agent/lib/services/agentProfileService";
import { AgentChangePasswordForm } from "@/sg-agent/components/AgentChangePasswordForm";
import { KycDocumentUploadSection } from "@/sg-agent/components/KycDocumentUploadSection";
import { RoarReferralCopyCard } from "@/components/roar/RoarReferralCopyCard";
import {
  getRoarReferralLink,
  getRoarReferralStats,
} from "@/sg-agent/lib/services/roarReferralService";

interface AgentDashboardContentProps {
  title: string;
  showEdit?: boolean;
}

function statusLabel(status?: string) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending Approval";
}

export function AgentDashboardContent({ title, showEdit = false }: AgentDashboardContentProps) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ fullName: "", mobile: "", address: "", city: "", panCard: "" });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["agent-profile"],
    queryFn: getAgentProfile,
  });

  const { data: roarStats } = useQuery({
    queryKey: ["agent-roar-referral-stats"],
    queryFn: getRoarReferralStats,
    staleTime: 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: updateAgentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-profile"] });
      toast.success("Profile updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAgentProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-profile"] });
      toast.success("Profile photo updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const fullName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim()
    : "";

  useEffect(() => {
    if (!profile || !showEdit) return;
    setForm({
      fullName: [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim(),
      mobile: profile.mobile ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      panCard: profile.panCard ?? "",
    });
  }, [profile, showEdit]);

  const imageUrl = profile ? profileImageUrl(profile) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your agent profile, Roar referrals, and account details
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error instanceof Error ? error.message : "Failed to load profile"}</p>}

      {roarStats && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Roar Credit Card Referrals</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatMini label="Total referrals" value={roarStats.total} />
            <StatMini label="Pending" value={roarStats.pending} />
            <StatMini label="In progress" value={roarStats.inProgress} />
            <StatMini label="Resolved" value={roarStats.resolved} />
          </div>
          <RoarReferralCopyCard getLink={getRoarReferralLink} queryScope="agent-dashboard" />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/agent/choice-connect/roar-bank-enquiry"
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              View my Roar enquiries
            </Link>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      ) : profile ? (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-muted">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-semibold text-muted-foreground">
                  {(profile.firstName?.[0] ?? "A").toUpperCase()}
                </span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadMutation.mutate(file);
            }} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploadMutation.isPending} className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
              {uploadMutation.isPending ? "Uploading..." : "Upload Photo"}
            </button>
            <p className="mt-3 text-xs capitalize text-muted-foreground">{statusLabel(profile.status)}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {showEdit ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateMutation.mutate({
                    fullName: form.fullName.trim(),
                    mobile: form.mobile.trim(),
                    address: form.address.trim() || undefined,
                    city: form.city.trim() || undefined,
                    panCard: form.panCard.trim() || undefined,
                  });
                }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <Field label="Full Name" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} />
                <Field label="Email" value={profile.email ?? ""} readOnly />
                <Field label="Mobile" value={form.mobile} onChange={(v) => setForm((p) => ({ ...p, mobile: v }))} />
                <Field label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
                <Field label="PAN Card" value={form.panCard} onChange={(v) => setForm((p) => ({ ...p, panCard: v.toUpperCase() }))} className="sm:col-span-1" />
                <Field label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} className="sm:col-span-2" />
                <div className="sm:col-span-2">
                  <button type="submit" disabled={updateMutation.isPending} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                    {updateMutation.isPending ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            ) : (
              <ProfileDetails profile={profile} fullName={fullName} />
            )}
            {showEdit && <AgentChangePasswordForm />}
          </div>
        </div>
      ) : null}

      {profile && (
        <KycDocumentUploadSection
          kycStatus={profile.kycStatus}
          panCard={profile.panCard}
          aadhaarCardNumber={profile.aadhaarCardNumber}
        />
      )}
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function ProfileDetails({ profile, fullName }: { profile: AgentProfile; fullName: string }) {
  const rows = [
    ["Full Name", fullName || "—"],
    ["Email", profile.email ?? "—"],
    ["Mobile", profile.mobile ?? "—"],
    ["City", profile.city ?? "—"],
    ["Address", profile.address ?? "—"],
    ["PAN Card", profile.panCard ?? "—"],
    ["Status", statusLabel(profile.status)],
    ["Joined", profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"],
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
  className,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm read-only:bg-muted/40"
      />
    </div>
  );
}
