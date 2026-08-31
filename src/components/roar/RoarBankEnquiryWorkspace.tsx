"use client";

import { Suspense, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconCopy, IconExternalLink, IconLink } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { EnquiriesPanel, type EnquiriesPanelApi } from "@/sg-admin/components/EnquiriesPanel";
import { RoarEnquiryCreateForm } from "@/components/roar/RoarEnquiryCreateForm";
import type { RoarReferralLink } from "@/components/roar/RoarReferralLinkPanel";
import { buildRoarReferralUrl } from "@/lib/config/env";
import { CommissionRatesCard } from "@/components/commissions/CommissionRatesCard";
import type { CommissionRatesResponse } from "@/sg-admin/lib/services/commissionService";

const TABS = [
  { id: "list", label: "List" },
  { id: "create", label: "Create" },
  { id: "referral", label: "Referral" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isTab(value: string | null): value is TabId {
  return value === "list" || value === "create" || value === "referral";
}

export function RoarBankEnquiryWorkspace(props: {
  title: string;
  subtitle: string;
  getLink: () => Promise<RoarReferralLink>;
  queryScope: string;
  createEnquiry: (body: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<{ applyUrl?: string }>;
  invalidateKeys: unknown[][];
  listPanel: {
    queryKeyPrefix: string;
    readOnly?: boolean;
    api?: EnquiriesPanelApi;
    categoryId?: string;
    serviceSlug: string;
  };
  getRates?: () => Promise<CommissionRatesResponse>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <RoarBankEnquiryWorkspaceInner {...props} />
    </Suspense>
  );
}

function RoarBankEnquiryWorkspaceInner({
  title,
  subtitle,
  getLink,
  queryScope,
  createEnquiry,
  invalidateKeys,
  listPanel,
  getRates,
}: {
  title: string;
  subtitle: string;
  getLink: () => Promise<RoarReferralLink>;
  queryScope: string;
  createEnquiry: (body: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<{ applyUrl?: string }>;
  invalidateKeys: unknown[][];
  listPanel: {
    queryKeyPrefix: string;
    readOnly?: boolean;
    api?: EnquiriesPanelApi;
    categoryId?: string;
    serviceSlug: string;
  };
  getRates?: () => Promise<CommissionRatesResponse>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = isTab(searchParams.get("tab")) ? (searchParams.get("tab") as TabId) : "list";

  const setTab = useCallback(
    (next: TabId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "list") params.delete("tab");
      else params.set("tab", next);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap gap-1 border-b border-border bg-muted/30 p-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={twMerge(
                "rounded-xl px-4 py-2 text-sm font-medium",
                tab === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          <div className={tab === "list" ? "block" : "hidden"}>
            <EnquiriesPanel
              hideHeader
              defaultStatus=""
              categoryId={listPanel.categoryId}
              serviceSlug={listPanel.serviceSlug}
              readOnly={listPanel.readOnly}
              queryKeyPrefix={listPanel.queryKeyPrefix}
              api={listPanel.api}
            />
          </div>

          {tab === "create" ? (
            <div className="space-y-5">
              {getRates ? (
                <CommissionRatesCard
                  getRates={getRates}
                  queryKey={["commission-rates", queryScope]}
                  highlight="roar"
                  title="Your Roar Bank commission"
                  description="You earn this when a customer completes a Roar Bank enquiry from your create or referral flow."
                />
              ) : null}
              <RoarEnquiryCreateForm
                createEnquiry={createEnquiry}
                invalidateKeys={invalidateKeys}
                onCreated={() => setTab("list")}
              />
            </div>
          ) : null}

          {tab === "referral" ? (
            <div className="space-y-5">
              {getRates ? (
                <CommissionRatesCard
                  getRates={getRates}
                  queryKey={["commission-rates", queryScope]}
                  highlight="roar"
                  title="Earn when you share this link"
                  description="Customers who open your referral link are attributed to you. Your Roar Bank payout is highlighted below."
                />
              ) : null}
              <ReferralPanel getLink={getLink} queryScope={queryScope} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ReferralPanel({
  getLink,
  queryScope,
}: {
  getLink: () => Promise<RoarReferralLink>;
  queryScope: string;
}) {
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
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Your referral link</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share this link with customers. New website enquiries will show your name and role.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <IconLink className="h-4 w-4 text-primary" />
          Roar referral URL
        </div>
        {isLoading ? <p className="mt-2 text-sm text-muted-foreground">Loading link…</p> : null}
        {error ? (
          <p className="mt-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load link"}
          </p>
        ) : null}
        {shareUrl ? (
          <p className="mt-2 break-all rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
            {shareUrl}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copy}
            disabled={!shareUrl}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            <IconCopy className="h-4 w-4" />
            Copy link
          </button>
          {shareUrl ? (
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <IconExternalLink className="h-4 w-4" />
              Open link
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
