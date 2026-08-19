"use client";

import { useQuery } from "@tanstack/react-query";
import { IconCopy, IconLink } from "@tabler/icons-react";
import { toast } from "sonner";
import type { RoarReferralLink } from "@/components/roar/RoarReferralLinkPanel";
import { buildRoarReferralUrl } from "@/lib/config/env";

interface RoarReferralCopyCardProps {
  getLink: () => Promise<RoarReferralLink>;
  queryScope: string;
}

export function RoarReferralCopyCard({ getLink, queryScope }: RoarReferralCopyCardProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["roar-referral-link", queryScope],
    queryFn: getLink,
    staleTime: 5 * 60 * 1000,
  });

  const shareUrl = data?.code ? buildRoarReferralUrl(data.code) : "";

  const copy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Roar referral link copied");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <IconLink className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Your Roar referral link</p>
          </div>
          {isLoading && (
            <p className="mt-1 text-xs text-muted-foreground">Loading link…</p>
          )}
          {error && (
            <p className="mt-1 text-xs text-destructive">
              {error instanceof Error ? error.message : "Failed to load link"}
            </p>
          )}
          {shareUrl && (
            <p className="mt-1 break-all text-xs text-muted-foreground">{shareUrl}</p>
          )}
        </div>
        <button
          type="button"
          onClick={copy}
          disabled={!shareUrl}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <IconCopy className="h-4 w-4" />
          Copy link
        </button>
      </div>
    </div>
  );
}
