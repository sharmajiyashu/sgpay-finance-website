"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IconRefresh } from "@tabler/icons-react";
import { Pagination } from "@/components/ui/Pagination";
import type {
  InsuranceLead,
  InsuranceRemoteEnquiry,
  InsuranceSummaryResponse,
} from "@/modules/insurance/types";

export interface InsuranceSummaryApiClient {
  getSummary: (params: Record<string, string | number | undefined>) => Promise<InsuranceSummaryResponse>;
}

interface InsuranceSummaryPanelProps {
  api: InsuranceSummaryApiClient;
  title?: string;
  queryScope?: string;
  /** Base path for Motor Apply page, e.g. /admin/insurance/motor */
  applyHref: string;
  showSourceFilter?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Issued", label: "Issued" },
  { value: "Policy Issued", label: "Policy Issued" },
  { value: "Rejected", label: "Rejected" },
  { value: "Draft", label: "Draft" },
];

function formatDate(value?: string): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function resumeHref(applyHref: string, uuid: string, vehicleType?: string): string {
  const params = new URLSearchParams({ uuid });
  if (vehicleType === "bike" || vehicleType === "car") {
    params.set("vehicleType", vehicleType);
  }
  return `${applyHref}?${params.toString()}`;
}

function RemoteRow({
  enquiry,
  applyHref,
}: {
  enquiry: InsuranceRemoteEnquiry;
  applyHref: string;
}) {
  const uuid = enquiry.uuid?.trim();
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-4 py-3 whitespace-nowrap">{formatDate(enquiry.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="font-medium">{enquiry.customerName || "—"}</div>
        <div className="text-xs text-muted-foreground">
          {[enquiry.customerMobile, enquiry.customerEmail].filter(Boolean).join(" · ") || "—"}
        </div>
      </td>
      <td className="px-4 py-3">{enquiry.subService || enquiry.serviceType || "—"}</td>
      <td className="px-4 py-3">{enquiry.agentName || enquiry.agentCode || "—"}</td>
      <td className="px-4 py-3 capitalize">{enquiry.status ?? "—"}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        {uuid || enquiry.enquiryId || "—"}
      </td>
      <td className="px-4 py-3">
        {uuid ? (
          <Link
            href={resumeHref(applyHref, uuid)}
            className="inline-flex rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10"
          >
            Resume
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  );
}

function LocalRow({
  lead,
  applyHref,
}: {
  lead: InsuranceLead;
  applyHref: string;
}) {
  const uuid = lead.uuid?.trim();
  const vehicleType =
    typeof lead.metadata?.vehicleType === "string" ? lead.metadata.vehicleType : undefined;
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-4 py-3 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="font-medium">{lead.customerName || "—"}</div>
        <div className="text-xs text-muted-foreground">
          {[lead.customerPhone, lead.customerEmail].filter(Boolean).join(" · ") || "—"}
        </div>
      </td>
      <td className="px-4 py-3 capitalize">{lead.sourceChannel}</td>
      <td className="px-4 py-3 capitalize">{lead.status ?? "—"}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{uuid || "—"}</td>
      <td className="px-4 py-3">
        {uuid ? (
          <Link
            href={resumeHref(applyHref, uuid, vehicleType)}
            className="inline-flex rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10"
          >
            Resume
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  );
}

export function InsuranceSummaryPanel({
  api,
  title = "Motor Insurance Summary",
  queryScope = "insurance-summary",
  applyHref,
  showSourceFilter = true,
}: InsuranceSummaryPanelProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceChannel, setSourceChannel] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeTab, setActiveTab] = useState<"choice" | "local">("choice");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: [
      "insurance-summary",
      queryScope,
      page,
      limit,
      statusFilter,
      sourceChannel,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      api.getSummary({
        page,
        limit,
        status: statusFilter || undefined,
        sourceChannel: sourceChannel || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      }),
  });

  const leads = data?.local.leads ?? [];
  const localPagination = data?.local.pagination;
  const remote = data?.remote;
  const remoteEnquiries = remote?.enquiries ?? [];
  const remotePagination = remote?.pagination;
  const remoteTotal =
    remotePagination?.total ?? remote?.overall.totalRecords ?? remoteEnquiries.length;
  const remoteTotalPages =
    remotePagination?.totalPages ?? Math.max(1, Math.ceil(remoteTotal / limit) || 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insurance summary-report from Choice Connect. Use Resume to continue an enquiry via UUID.
          </p>
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

      {!data?.authConfigured && data && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Choice Connect API credentials are not configured on SG-Backend.
        </div>
      )}

      {remote?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">Insurance summary-report failed</p>
          <p className="mt-1">{remote.error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {showSourceFilter && (
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Source</label>
            <select
              value={sourceChannel}
              onChange={(e) => {
                setSourceChannel(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">All sources</option>
              <option value="website">Website</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Page size</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("choice")}
          className={`px-3 py-2 text-sm font-medium ${
            activeTab === "choice"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          Choice Connect ({remoteTotal})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("local")}
          className={`px-3 py-2 text-sm font-medium ${
            activeTab === "local"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          Local leads ({localPagination?.total ?? leads.length})
        </button>
      </div>

      {isLoading && (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error instanceof Error ? error.message : "Failed to load insurance summary"}
        </div>
      )}

      {!isLoading && !error && activeTab === "choice" && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">UUID</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {remoteEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No remote insurance enquiries found.
                  </td>
                </tr>
              ) : (
                remoteEnquiries.map((enquiry, i) => (
                  <RemoteRow
                    key={`${enquiry.uuid || enquiry.enquiryId || i}`}
                    enquiry={enquiry}
                    applyHref={applyHref}
                  />
                ))
              )}
            </tbody>
          </table>
          {remoteTotalPages > 1 && (
            <div className="border-t border-border p-3">
              <Pagination
                page={page}
                totalPages={remoteTotalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && activeTab === "local" && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">UUID</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No local insurance leads yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <LocalRow key={lead._id} lead={lead} applyHref={applyHref} />
                ))
              )}
            </tbody>
          </table>
          {(localPagination?.totalPages ?? 1) > 1 && (
            <div className="border-t border-border p-3">
              <Pagination
                page={page}
                totalPages={localPagination?.totalPages ?? 1}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
