"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconCopy, IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";
import type {
  ChoiceLead,
  ChoiceRemoteEnquiry,
  ChoiceSummaryResponse,
} from "@/lib/choiceConnect/types";
import { formatProductLabel, formatSourceLabel } from "@/lib/choiceConnect/types";
import { getChoiceConnectDiagnostics } from "@/sg-admin/lib/services/choiceConnectService";

export interface ChoiceConnectSummaryApiClient {
  getSummary: (params: Record<string, string | number | undefined>) => Promise<ChoiceSummaryResponse>;
}

interface ChoiceConnectSummaryPanelProps {
  api: ChoiceConnectSummaryApiClient;
  title?: string;
  showAllSources?: boolean;
  queryScope?: string;
}

const PRODUCT_FILTER_OPTIONS = [
  { value: "", label: "All products" },
  { value: "credit-card", label: "Credit Card" },
  { value: "personal-loan", label: "Personal Loan" },
  { value: "business-loan", label: "Business Loan" },
  { value: "home-loan", label: "Home Loan" },
  { value: "other-loan", label: "Other Loan" },
];

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

function sourceBadgeClass(channel: string): string {
  if (channel === "website") return "bg-blue-100 text-blue-800";
  if (channel === "agent") return "bg-emerald-100 text-emerald-800";
  if (channel === "admin") return "bg-violet-100 text-violet-800";
  return "bg-gray-100 text-gray-800";
}

function SummaryStatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function RemoteEnquiryRow({ enquiry }: { enquiry: ChoiceRemoteEnquiry }) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-4 py-3 whitespace-nowrap">{formatDate(enquiry.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="font-medium">{enquiry.customerName || "—"}</div>
        <div className="text-xs text-muted-foreground">
          {[enquiry.customerMobile, enquiry.customerEmail].filter(Boolean).join(" · ") || "—"}
        </div>
      </td>
      <td className="px-4 py-3">
        {enquiry.subService || enquiry.serviceType || "—"}
      </td>
      <td className="px-4 py-3">{enquiry.agentName || enquiry.agentCode || "—"}</td>
      <td className="px-4 py-3 capitalize">{enquiry.status ?? "—"}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
        {enquiry.subStatus ?? "—"}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        {enquiry.uuid || enquiry.enquiryId || "—"}
      </td>
    </tr>
  );
}

export function ChoiceConnectSummaryPanel({
  api,
  title = "Choice Connect Summary",
  showAllSources = true,
  queryScope = "summary",
}: ChoiceConnectSummaryPanelProps) {
  const [page, setPage] = useState(1);
  const [productType, setProductType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceChannel, setSourceChannel] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeTab, setActiveTab] = useState<"choice" | "local">("choice");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: [
      "choice-connect-summary",
      queryScope,
      page,
      productType,
      statusFilter,
      sourceChannel,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      api.getSummary({
        page,
        limit: 20,
        productType: productType || undefined,
        status: statusFilter || undefined,
        sourceChannel: sourceChannel || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      }),
  });

  const leads = data?.local.leads ?? [];
  const pagination = data?.local.pagination;
  const remote = data?.remote;
  const remoteEnquiries = remote?.enquiries ?? [];
  const debugReport = remote?.debug?.reportText;

  const copyReport = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Diagnostic report copied — send this to Choice Connect team");
    } catch {
      toast.error("Could not copy. Select text manually.");
    }
  };

  const runFullDiagnostics = async () => {
    try {
      const report = await getChoiceConnectDiagnostics();
      await copyReport(report.reportText);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Diagnostics failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choice Connect Partner API summary + your local tracking records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            <IconRefresh className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {queryScope === "admin" && (
            <button
              type="button"
              onClick={runFullDiagnostics}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary hover:bg-primary/10"
            >
              Run diagnostics & copy report
            </button>
          )}
        </div>
      </div>

      {!data?.authConfigured && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Choice Connect API login not configured on backend. Add{" "}
          <code className="text-xs">CHOICE_CONNECT_USERNAME</code>,{" "}
          <code className="text-xs">CHOICE_CONNECT_PASSWORD</code>,{" "}
          <code className="text-xs">CHOICE_CONNECT_SECRET_KEY</code>, and{" "}
          <code className="text-xs">CHOICE_CONNECT_PARTNER_ID</code> (or{" "}
          <code className="text-xs">CHOICE_CONNECT_API_TOKEN</code>) in SG-Backend `.env`.
        </div>
      )}

      {remote?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">Choice Connect report failed</p>
          <p className="mt-1">{remote.error}</p>
          <p className="mt-2 text-xs text-red-700">
            Common causes: wrong login URL, invalid username/password, missing API token, or summary API not enabled for your partner account.
          </p>
        </div>
      )}

      {remote?.debug && (
        <details className="rounded-xl border border-border bg-card p-4" open={Boolean(remote.error)}>
          <summary className="cursor-pointer text-sm font-medium">
            Diagnostic details (share with Choice Connect support)
          </summary>
          <div className="mt-3 space-y-3">
            {remote.debug.steps.map((step, i) => (
              <div
                key={`${step.step}-${i}`}
                className={`rounded-lg border p-3 text-xs ${
                  step.success ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
                }`}
              >
                <p className="font-semibold">
                  [{step.success ? "OK" : "FAIL"}] {step.step}
                </p>
                {step.url && <p className="mt-1 break-all">URL: {step.url}</p>}
                {step.httpStatus !== undefined && <p>HTTP: {step.httpStatus}</p>}
                {step.request && (
                  <p className="mt-1 break-all">Request: {JSON.stringify(step.request)}</p>
                )}
                {step.responsePreview && (
                  <p className="mt-1 break-all whitespace-pre-wrap">Response: {step.responsePreview}</p>
                )}
                {step.error && <p className="mt-1 font-medium text-red-800">Error: {step.error}</p>}
              </div>
            ))}
            {debugReport && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => copyReport(debugReport)}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs hover:bg-muted"
                >
                  <IconCopy className="h-3.5 w-3.5" />
                  Copy full report
                </button>
              </div>
            )}
            {debugReport && (
              <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap">
                {debugReport}
              </pre>
            )}
          </div>
        </details>
      )}

      {remote?.available && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryStatCard label="Total (Choice Connect)" value={remote.overall.totalRecords} />
          <SummaryStatCard
            label="Status types"
            value={Object.keys(remote.overall.statusCounts).length}
          />
          <SummaryStatCard
            label="Sub-services"
            value={Object.keys(remote.overall.subServiceCounts).length}
          />
          <SummaryStatCard label="Local tracked" value={pagination?.total ?? leads.length} />
        </div>
      )}

      {remote?.available && Object.keys(remote.overall.statusCounts).length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Status-wise count</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(remote.overall.statusCounts).map(([status, count]) => (
              <span
                key={status}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
              >
                {status}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {remote?.available && Object.keys(remote.overall.subServiceCounts).length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Sub-service breakdown</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(remote.overall.subServiceCounts).map(([service, count]) => (
              <span
                key={service}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {service}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-card p-4">
        <select
          value={productType}
          onChange={(e) => {
            setProductType(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {PRODUCT_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || "all-status"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {showAllSources && (
          <select
            value={sourceChannel}
            onChange={(e) => {
              setSourceChannel(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All local sources</option>
            <option value="website">Website</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin Panel</option>
          </select>
        )}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
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

      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("choice")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
            activeTab === "choice"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Choice Connect Report ({remoteEnquiries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("local")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
            activeTab === "local"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Local Tracking ({pagination?.total ?? leads.length})
        </button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading summary…</p>}
      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load summary"}
        </p>
      )}

      {activeTab === "choice" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sub-status</th>
                  <th className="px-4 py-3 font-medium">Ref</th>
                </tr>
              </thead>
              <tbody>
                {remoteEnquiries.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No Choice Connect enquiries returned for selected filters.
                    </td>
                  </tr>
                ) : (
                  remoteEnquiries.map((enquiry) => (
                    <RemoteEnquiryRow key={enquiry.enquiryId || enquiry.uuid} enquiry={enquiry} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "local" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Ref</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No local records found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead: ChoiceLead) => (
                    <tr key={lead._id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{lead.customerName || "—"}</div>
                        <div className="text-xs text-muted-foreground">
                          {[lead.customerPhone, lead.customerEmail].filter(Boolean).join(" · ") || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">{formatProductLabel(lead.productType)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceBadgeClass(lead.sourceChannel)}`}
                        >
                          {formatSourceLabel(lead)}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">{lead.status ?? "initiated"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {lead.uuid || lead._id.slice(-8)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "local" && pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
