"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconCopy, IconLink, IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";
import type { InsuranceReferralLinkItem } from "@/modules/insurance/types";
import { referralLinkGroup } from "@/lib/choiceConnect/types";
import { buildShareableReferralLink } from "@/lib/choiceConnect/referralLink";

export interface InsuranceReferralApiClient {
  getReferralLinks: (agentCode?: string) => Promise<{
    links: InsuranceReferralLinkItem[];
    agentCode?: string;
    referrerName?: string;
    referrerRole?: string;
  }>;
}

interface InsuranceReferralLinksPanelProps {
  api: InsuranceReferralApiClient;
  title?: string;
  description?: string;
  queryScope?: string;
  defaultAgentCode?: string;
  showAgentCodeFilter?: boolean;
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
  toast.success("Link copied to clipboard");
}

function ReferralCard({ item, agentId }: { item: InsuranceReferralLinkItem; agentId?: string }) {
  const title = item.title || item.productType || "Referral Link";
  const shareableLink = item.link ? buildShareableReferralLink(item.link, agentId) : undefined;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <IconLink className="h-4 w-4 shrink-0 text-primary" />
            <h3 className="font-medium text-foreground">{title}</h3>
          </div>
          {item.description && (
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          )}
          {shareableLink ? (
            <p className="mt-2 break-all text-xs text-muted-foreground">{shareableLink}</p>
          ) : (
            <p className="mt-2 text-xs text-amber-700">No link returned from Choice Connect</p>
          )}
        </div>
        {shareableLink && (
          <button
            type="button"
            onClick={() => copyText(shareableLink)}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <IconCopy className="h-3.5 w-3.5" />
            Copy
          </button>
        )}
      </div>
    </div>
  );
}

export function InsuranceReferralLinksPanel({
  api,
  title = "Insurance Referral Links",
  description = "Generate Choice Connect referral links for Motor Insurance journeys.",
  queryScope = "insurance-referrals",
  defaultAgentCode = "",
  showAgentCodeFilter = false,
}: InsuranceReferralLinksPanelProps) {
  const [agentCode, setAgentCode] = useState(defaultAgentCode);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["insurance-referral-links", queryScope, agentCode],
    queryFn: () => api.getReferralLinks(agentCode.trim() || undefined),
    staleTime: 5 * 60 * 1000,
  });

  const links = useMemo(() => {
    const all = data?.links ?? [];
    const insuranceOnly = all.filter((item) => referralLinkGroup(item) === "insurance");
    return insuranceOnly.length > 0 ? insuranceOnly : all;
  }, [data?.links]);

  const sharingName = data?.referrerName;
  const sharingRole = data?.referrerRole;
  const sharingCode = data?.agentCode;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {(sharingName || sharingCode) && (
            <p className="mt-2 text-sm text-foreground">
              Sharing as:{" "}
              <span className="font-medium">{sharingName || "—"}</span>
              {sharingRole ? ` · ${sharingRole}` : ""}
              {sharingCode ? (
                <span className="text-muted-foreground"> · {sharingCode}</span>
              ) : null}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          <IconRefresh className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {showAgentCodeFilter && (
        <div className="max-w-xs">
          <label className="mb-1 block text-sm font-medium">Agent code (optional)</label>
          <input
            value={agentCode}
            onChange={(e) => setAgentCode(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="CBA / agent code"
          />
        </div>
      )}

      {isLoading && <div className="h-32 animate-pulse rounded-xl bg-muted" />}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error instanceof Error ? error.message : "Failed to load referral links"}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-3 md:grid-cols-2">
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground md:col-span-2">
              No referral links returned for insurance.
            </p>
          ) : (
            links.map((item, i) => (
              <ReferralCard
                key={`${item.link || item.title || i}`}
                item={item}
                agentId={sharingCode || agentCode || undefined}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
