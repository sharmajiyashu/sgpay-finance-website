"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconCopy, IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";
import type {
  ChoiceRemoteEnquiry,
  ChoiceSummaryResponse,
} from "@/lib/choiceConnect/types";
import { resolveReferredByName } from "@/lib/choiceConnect/types";
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

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const PRODUCT_FILTER_OPTIONS = [
  { value: "", label: "All products" },
  { value: "credit-card", label: "Credit Card" },
  { value: "motor-insurance", label: "Motor Insurance" },
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
  { value: "Disbursed", label: "Disbursed" },
  { value: "Done", label: "Done" },
  { value: "On Hold", label: "On Hold" },
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

function DetailChips({ items }: { items: Array<[string, string | undefined]> }) {
  const visible = items.filter(([, value]) => Boolean(value && String(value).trim()));
  if (visible.length === 0) return null;
  return (
    <dl className="mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-3">
      {visible.map(([label, value]) => (
        <div key={label}>
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="break-all font-medium text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function extraRawFields(raw?: Record<string, unknown>, skip: string[] = []): Array<[string, string]> {
  if (!raw) return [];
  const skipSet = new Set(skip.map((k) => k.toLowerCase()));
  const rows: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(raw)) {
    if (skipSet.has(key.toLowerCase())) continue;
    if (value == null || value === "") continue;
    if (typeof value === "object") continue;
    rows.push([key.replace(/_/g, " "), String(value)]);
  }
  return rows.slice(0, 24);
}

function RemoteEnquiryRow({ enquiry }: { enquiry: ChoiceRemoteEnquiry }) {
  const [open, setOpen] = useState(false);
  const location = [enquiry.city, enquiry.district, enquiry.state, enquiry.pincode]
    .filter(Boolean)
    .join(", ");
  const extra = extraRawFields(enquiry.raw, [
    "enquiry_id",
    "enquiryId",
    "id",
    "uuid",
    "customer_name",
    "customerName",
    "name",
    "customer_email",
    "customerEmail",
    "email",
    "customer_mobile",
    "customerMobile",
    "mobile",
    "agent_name",
    "agentName",
    "agent_code",
    "agentCode",
    "referred_by_name",
    "referredByName",
    "status",
    "sub_status",
    "subStatus",
    "state",
    "district",
    "created_at",
    "createdAt",
    "updated_at",
    "updatedAt",
  ]);

  return (
    <>
      <tr className="border-b border-border/60 last:border-0">
        <td className="px-4 py-3 whitespace-nowrap">{formatDate(enquiry.createdAt)}</td>
        <td className="px-4 py-3">
          <div className="font-medium">{enquiry.customerName || "—"}</div>
          <div className="text-xs text-muted-foreground">
            {[enquiry.customerMobile, enquiry.customerEmail].filter(Boolean).join(" · ") || "—"}
          </div>
        </td>
        <td className="px-4 py-3">
          <div>{enquiry.subService || enquiry.serviceType || "—"}</div>
          {enquiry.cardType || enquiry.bankName ? (
            <div className="text-xs text-muted-foreground">
              {[enquiry.bankName, enquiry.cardType].filter(Boolean).join(" · ")}
            </div>
          ) : null}
        </td>
        <td className="px-4 py-3">
          <div className="font-medium">
            {resolveReferredByName(enquiry) || "—"}
          </div>
          {enquiry.referredByRole ? (
            <div className="text-xs text-muted-foreground">{enquiry.referredByRole}</div>
          ) : null}
          {enquiry.referredBySource ? (
            <span
              className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${sourceBadgeClass(enquiry.referredBySource)}`}
            >
              {enquiry.referredBySource === "admin"
                ? "Admin Panel"
                : enquiry.referredBySource === "agent"
                  ? "Agent Panel"
                  : "Website"}
            </span>
          ) : null}
          <div className="text-xs text-muted-foreground">
            {[enquiry.subAgentCode, enquiry.agentCode, enquiry.cbaCode]
              .filter((value, index, all) => value && all.indexOf(value) === index)
              .join(" · ") || "—"}
          </div>
        </td>
        <td className="px-4 py-3 text-xs">{location || "—"}</td>
        <td className="px-4 py-3 capitalize">{enquiry.status ?? "—"}</td>
        <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
          {enquiry.subStatus ?? "—"}
        </td>
        <td className="px-4 py-3">
          <div className="font-mono text-xs text-muted-foreground">
            {enquiry.uuid || enquiry.enquiryId || "—"}
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-1 text-xs font-medium text-primary hover:underline"
          >
            {open ? "Hide details" : "Full details"}
          </button>
        </td>
      </tr>
      {open && (
        <tr className="border-b border-border/60 bg-muted/30">
          <td colSpan={8} className="px-4 py-3">
            <DetailChips
              items={[
                ["Enquiry ID", enquiry.enquiryId],
                ["UUID", enquiry.uuid],
                ["Customer", enquiry.customerName],
                ["Mobile", enquiry.customerMobile],
                ["Email", enquiry.customerEmail],
                ["Service", enquiry.serviceType],
                ["Sub-service", enquiry.subService],
                ["Referred by", resolveReferredByName(enquiry)],
                ["Referrer role", enquiry.referredByRole],
                [
                  "Referrer source",
                  enquiry.referredBySource === "admin"
                    ? "Admin Panel"
                    : enquiry.referredBySource === "agent"
                      ? "Agent Panel"
                      : enquiry.referredBySource === "website"
                        ? "Website"
                        : undefined,
                ],
                ["Agent", enquiry.agentName],
                ["Agent code", enquiry.agentCode],
                ["Sub-agent", enquiry.subAgentName],
                ["Sub-agent code", enquiry.subAgentCode],
                ["Status", enquiry.status],
                ["Sub-status", enquiry.subStatus],
                ["State", enquiry.state],
                ["District", enquiry.district],
                ["City", enquiry.city],
                ["Pincode", enquiry.pincode],
                ["Bank", enquiry.bankName],
                ["Card", enquiry.cardType],
                ["Remarks", enquiry.remarks],
                ["Created", formatDate(enquiry.createdAt)],
                ["Updated", formatDate(enquiry.updatedAt)],
                ...extra,
              ]}
            />
          </td>
        </tr>
      )}
    </>
  );
}

export function ChoiceConnectSummaryPanel({
  api,
  title = "Choice Connect Summary",
  queryScope = "summary",
}: ChoiceConnectSummaryPanelProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [productType, setProductType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: [
      "choice-connect-summary",
      queryScope,
      page,
      limit,
      productType,
      statusFilter,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      api.getSummary({
        page,
        limit,
        productType: productType || undefined,
        status: statusFilter || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      }),
  });

  const remote = data?.remote;
  const remoteEnquiries = remote?.enquiries ?? [];
  const remotePagination = remote?.pagination;
  const remoteTotal =
    remotePagination?.total ??
    remote?.overall.totalRecords ??
    remoteEnquiries.length;
  const remoteTotalPages =
    remotePagination?.totalPages ??
    Math.max(1, Math.ceil(remoteTotal / limit) || 1);
  const debugReport = remote?.debug?.reportText;

  const resetFilters = () => {
    setProductType("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setLimit(20);
    setPage(1);
  };

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
            Official Choice Connect applications — credit card, motor insurance, and
            loans. If the apply was started from admin, agent, or website, the
            referrer is shown on the same row.
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
          <SummaryStatCard
            label="With referrer"
            value={remoteEnquiries.filter((enquiry) => resolveReferredByName(enquiry)).length}
          />
        </div>
      )}

      {remote?.available && Object.keys(remote.overall.statusCounts).length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Status-wise count</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(remote.overall.statusCounts).map(([status, count]) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {status}: {count}
              </button>
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

      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Filters</h2>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear filters
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
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
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Page size
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {remoteTotal} applications from Choice Connect
        {productType ? ` · ${PRODUCT_FILTER_OPTIONS.find((opt) => opt.value === productType)?.label}` : ""}.
      </p>

      {isLoading && <p className="text-sm text-muted-foreground">Loading summary…</p>}
      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load summary"}
        </p>
      )}

      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Referred by</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sub-status</th>
                  <th className="px-4 py-3 font-medium">Ref</th>
                </tr>
              </thead>
              <tbody>
                {remoteEnquiries.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No Choice Connect enquiries returned for selected filters.
                    </td>
                  </tr>
                ) : (
                  remoteEnquiries.map((enquiry) => (
                    <RemoteEnquiryRow
                      key={enquiry.enquiryId || enquiry.uuid || `${enquiry.customerMobile}-${enquiry.createdAt}`}
                      enquiry={enquiry}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          page={remotePagination?.page ?? page}
          totalPages={remoteTotalPages}
          onPageChange={setPage}
          total={remoteTotal}
          limit={remotePagination?.limit ?? limit}
        />
      </div>
    </div>
  );
}
