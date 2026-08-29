"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconCopy, IconLink, IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";
import type { ChoiceReferralLinkItem } from "@/lib/choiceConnect/types";
import { formatProductLabel, referralLinkGroup } from "@/lib/choiceConnect/types";
import { buildShareableReferralLink } from "@/lib/choiceConnect/referralLink";

export interface ChoiceConnectReferralApiClient {
  getReferralLinks: (agentCode?: string) => Promise<{
    links: ChoiceReferralLinkItem[];
    agentCode?: string;
    referrerName?: string;
    referrerRole?: string;
  }>;
}

interface ChoiceConnectReferralLinksPanelProps {
  api: ChoiceConnectReferralApiClient;
  title?: string;
  description?: string;
  queryScope?: string;
  defaultAgentCode?: string;
  showAgentCodeFilter?: boolean;
}

const GROUP_ORDER = ["credit-card", "loan", "insurance", "other"] as const;
const GROUP_LABELS: Record<(typeof GROUP_ORDER)[number], string> = {
  "credit-card": "Credit Cards",
  loan: "Loans",
  insurance: "Insurance",
  other: "Other products",
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
  toast.success("Link copied to clipboard");
}

function ReferralCard({ item, agentId }: { item: ChoiceReferralLinkItem; agentId?: string }) {
  const title =
    item.title ||
    (item.productType ? formatProductLabel(item.productType) : "Referral Link");

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

export function ChoiceConnectReferralLinksPanel({
  api,
  title = "Referral Links",
  description = "Generate and share Choice Connect product referral links with customers.",
  queryScope = "staff",
  defaultAgentCode = "",
  showAgentCodeFilter = false,
}: ChoiceConnectReferralLinksPanelProps) {
  const [agentCode, setAgentCode] = useState(defaultAgentCode);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["choice-connect-referral-links", queryScope, agentCode],
    queryFn: () => api.getReferralLinks(agentCode.trim() || undefined),
    staleTime: 5 * 60 * 1000,
  });

  const grouped = useMemo(() => {
    const links = data?.links ?? [];
    const buckets: Record<(typeof GROUP_ORDER)[number], ChoiceReferralLinkItem[]> = {
      "credit-card": [],
      loan: [],
      insurance: [],
      other: [],
    };
    for (const item of links) {
      buckets[referralLinkGroup(item)].push(item);
    }
    return GROUP_ORDER.filter((key) => buckets[key].length > 0).map((key) => ({
      key,
      label: GROUP_LABELS[key],
      items: buckets[key],
    }));
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
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-60"
        >
          <IconRefresh className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {showAgentCodeFilter && (
        <div className="max-w-sm">
          <label className="mb-1 block text-sm font-medium">Agent Code (optional)</label>
          <input
            type="text"
            value={agentCode}
            onChange={(e) => setAgentCode(e.target.value)}
            placeholder="C0002020"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      )}

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Failed to load referral links.
          {error instanceof Error ? ` ${error.message}` : ""}
        </div>
      )}

      {!isLoading && !error && data?.links?.length === 0 && (
        <div className="rounded-xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          No referral links returned. Check Choice Connect credentials and agent code.
        </div>
      )}

      {!isLoading && grouped.length > 0 && (
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.key} className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">{group.label}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item, index) => (
                  <ReferralCard
                    key={`${group.key}-${item.link ?? item.title ?? index}`}
                    item={item}
                    agentId={data?.agentCode}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
