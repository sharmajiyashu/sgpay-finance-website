"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { listUrl, unwrapList, type PaginationMeta } from "@/sg-admin/lib/paginated-list";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import {
  deleteEnquiry as adminDeleteEnquiry,
  getEnquiries as adminGetEnquiries,
  updateEnquiryStatus as adminUpdateEnquiryStatus,
} from "@/sg-admin/lib/services/enquiryService";
import type { Enquiry, EnquiryStatus } from "@/sg-admin/lib/types/enquiry";
import { Pagination } from "@/components/ui/Pagination";
import {
  ENQUIRY_CATEGORIES,
  getCategoryLabel,
  getEnquiryCatalogStats,
  getEnquiryCategory,
  getServiceLabel,
  getServicesForCategory,
} from "@/lib/enquiryCatalog";

export interface EnquiriesListResponse {
  enquiries: Enquiry[];
  pagination: PaginationMeta;
}

export interface EnquiriesPanelApi {
  listPath: string;
  getEnquiries: (url: string) => Promise<EnquiriesListResponse>;
  updateEnquiryStatus?: (id: string, status: EnquiryStatus) => Promise<Enquiry>;
  deleteEnquiry?: (id: string) => Promise<void>;
}

const defaultAdminApi: EnquiriesPanelApi = {
  listPath: ADMIN_API_PATHS.enquiries,
  getEnquiries: adminGetEnquiries,
  updateEnquiryStatus: adminUpdateEnquiryStatus,
  deleteEnquiry: adminDeleteEnquiry,
};

const STATUS_OPTIONS: { value: EnquiryStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

function statusBadgeClass(status: EnquiryStatus) {
  if (status === "resolved") return "bg-emerald-500/10 text-emerald-700";
  if (status === "in_progress") return "bg-amber-500/10 text-amber-700";
  return "bg-sky-500/10 text-sky-700";
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border/60 py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground break-words">{children}</dd>
    </div>
  );
}

function EnquiryDetailDialog({
  enquiry,
  open,
  onClose,
  onStatusChange,
  statusPending,
  readOnly,
}: {
  enquiry: Enquiry | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: EnquiryStatus) => void;
  statusPending: boolean;
  readOnly?: boolean;
}) {
  if (!open || !enquiry) return null;

  const meta = enquiry.metadata ?? {};
  const partnerName =
    typeof meta.partnerName === "string" ? meta.partnerName : undefined;
  const bank = typeof meta.bank === "string" ? meta.bank : undefined;
  const applyUrl = typeof meta.applyUrl === "string" ? meta.applyUrl : undefined;
  const partnerId =
    typeof meta.partnerId === "string" ? meta.partnerId : undefined;
  const isPartnerLead = Boolean(partnerName || partnerId || applyUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-background px-5 py-4">
          <div>
            <h2 id="enquiry-detail-title" className="text-lg font-semibold">
              Enquiry details
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {getServiceLabel(enquiry.type, enquiry.service)} ·{" "}
              {getCategoryLabel(enquiry.type)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-sm"
          >
            Close
          </button>
        </div>

        <div className="px-5 py-2">
          {isPartnerLead && (
            <div className="mb-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-sm font-semibold text-primary">
                {partnerName || "Partner credit card"} enquiry
              </p>
              {bank && (
                <p className="mt-1 text-xs text-muted-foreground">{bank}</p>
              )}
            </div>
          )}

          <dl>
            <DetailRow label="Name">{enquiry.name}</DetailRow>
            <DetailRow label="Email">
              <a
                href={`mailto:${enquiry.email}`}
                className="text-primary hover:underline"
              >
                {enquiry.email}
              </a>
            </DetailRow>
            <DetailRow label="Phone">
              {enquiry.phone ? (
                <a
                  href={`tel:${enquiry.phone}`}
                  className="text-primary hover:underline"
                >
                  {enquiry.phone}
                </a>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label="Category">
              <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {getCategoryLabel(enquiry.type)}
              </span>
            </DetailRow>
            <DetailRow label="Service">
              {getServiceLabel(enquiry.type, enquiry.service)}
            </DetailRow>
            {enquiry.subject && (
              <DetailRow label="Subject">{enquiry.subject}</DetailRow>
            )}
            <DetailRow label="Message">
              <p className="whitespace-pre-wrap">{enquiry.message}</p>
            </DetailRow>
            {enquiry.pageUrl && (
              <DetailRow label="Page">
                <span className="font-mono text-xs">{enquiry.pageUrl}</span>
              </DetailRow>
            )}
            {applyUrl && (
              <DetailRow label="Apply link">
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-primary hover:underline"
                >
                  {applyUrl}
                </a>
              </DetailRow>
            )}
            {partnerId && (
              <DetailRow label="Partner ID">
                <span className="font-mono text-xs">{partnerId}</span>
              </DetailRow>
            )}
            <DetailRow label="Status">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadgeClass(enquiry.status)}`}
                >
                  {enquiry.status.replace("_", " ")}
                </span>
                {!readOnly && (
                  <select
                    value={enquiry.status}
                    disabled={statusPending}
                    onChange={(e) =>
                      onStatusChange(enquiry._id, e.target.value as EnquiryStatus)
                    }
                    className="rounded-lg border border-border bg-background px-2 py-1 text-xs capitalize"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                )}
              </div>
            </DetailRow>
            <DetailRow label="Created">
              {new Date(enquiry.createdAt).toLocaleString()}
            </DetailRow>
            <DetailRow label="Updated">
              {new Date(enquiry.updatedAt).toLocaleString()}
            </DetailRow>
          </dl>
        </div>
      </div>
    </div>
  );
}

interface EnquiriesPanelProps {
  categoryId?: string;
  /** Lock list to one service slug (e.g. roar-credit-card) */
  serviceSlug?: string;
  title?: string;
  subtitle?: string;
  /** Custom API (admin by default). Agent uses read-only list API. */
  api?: EnquiriesPanelApi;
  readOnly?: boolean;
  queryKeyPrefix?: string;
}

export function EnquiriesPanel({
  categoryId,
  serviceSlug,
  title: titleOverride,
  subtitle: subtitleOverride,
  api = defaultAdminApi,
  readOnly = false,
  queryKeyPrefix = "admin-enquiries",
}: EnquiriesPanelProps) {
  const queryClient = useQueryClient();
  const category = categoryId ? getEnquiryCategory(categoryId) : undefined;
  const lockedService = Boolean(serviceSlug);
  const canUpdateStatus = Boolean(api.updateEnquiryStatus) && !readOnly;
  const canDelete = Boolean(api.deleteEnquiry) && !readOnly;

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(categoryId ?? "");
  const [serviceFilter, setServiceFilter] = useState(serviceSlug ?? "");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const serviceOptions = useMemo(() => {
    if (typeFilter) return getServicesForCategory(typeFilter);
    return ENQUIRY_CATEGORIES.flatMap((c) => c.services);
  }, [typeFilter]);

  const url = listUrl(api.listPath, page, searchQuery, 20, {
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    service: serviceFilter || undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeyPrefix, page, searchQuery, statusFilter, typeFilter, serviceFilter],
    queryFn: () => api.getEnquiries(url),
  });

  const { items: enquiries, pagination } = unwrapList<Enquiry>(
    data as Record<string, unknown> | undefined,
    "enquiries"
  );

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) => {
      if (!api.updateEnquiryStatus) {
        return Promise.reject(new Error("Status update not available"));
      }
      return api.updateEnquiryStatus(id, status);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setSelectedEnquiry((prev) =>
        prev && prev._id === updated._id ? { ...prev, ...updated } : prev
      );
      toast.success("Status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!api.deleteEnquiry) {
        return Promise.reject(new Error("Delete not available"));
      }
      return api.deleteEnquiry(id);
    },
    onSuccess: () => {
      setDeleteId(null);
      setSelectedEnquiry(null);
      queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Enquiry deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const stats = getEnquiryCatalogStats();
  const title =
    titleOverride ??
    (lockedService && serviceSlug
      ? getServiceLabel(typeFilter || "finance", serviceSlug)
      : category
        ? `${category.label} Enquiries`
        : "All Enquiries");
  const subtitle =
    subtitleOverride ??
    (lockedService
      ? "Enquiries submitted from the website Roar Credit Card apply form only"
      : category
        ? `${category.services.length} service types in ${category.label}`
        : `${stats.categories} categories · ${stats.servicePages} enquiry sources`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div
        className={`grid gap-3 sm:grid-cols-2 ${lockedService ? "lg:grid-cols-3" : "lg:grid-cols-5"}`}
      >
        <div className={`relative ${lockedService ? "lg:col-span-2" : "lg:col-span-2"}`}>
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search name, email, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {!lockedService && (
          <>
            <select
              value={typeFilter}
              disabled={!!categoryId}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setServiceFilter("");
                setPage(1);
              }}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm disabled:opacity-70"
            >
              <option value="">All categories</option>
              {ENQUIRY_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label} ({c.services.length})</option>
              ))}
            </select>
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm lg:col-span-2"
            >
              <option value="">All services</option>
              {typeFilter
                ? serviceOptions.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.label}</option>
                  ))
                : ENQUIRY_CATEGORIES.flatMap((c) =>
                    c.services.map((s) => (
                      <option key={`${c.id}-${s.slug}`} value={s.slug}>
                        {c.label} — {s.label}
                      </option>
                    ))
                  )}
            </select>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load enquiries"}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading enquiries...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => {
                  const partnerName =
                    typeof enquiry.metadata?.partnerName === "string"
                      ? enquiry.metadata.partnerName
                      : null;

                  return (
                    <tr key={enquiry._id} className="border-b border-border/50 align-top">
                      <td className="px-4 py-3">
                        <div className="font-medium">{enquiry.name}</div>
                        <div className="text-muted-foreground">{enquiry.email}</div>
                        {enquiry.phone && (
                          <div className="text-xs text-muted-foreground">{enquiry.phone}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {getCategoryLabel(enquiry.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div>{getServiceLabel(enquiry.type, enquiry.service)}</div>
                        {partnerName && (
                          <div className="mt-1 text-xs text-primary">{partnerName}</div>
                        )}
                      </td>
                      <td className="max-w-xs px-4 py-3">
                        <p className="line-clamp-3 text-muted-foreground">{enquiry.message}</p>
                      </td>
                      <td className="px-4 py-3">
                        {canUpdateStatus ? (
                          <select
                            value={enquiry.status}
                            disabled={statusMutation.isPending}
                            onChange={(e) =>
                              statusMutation.mutate({
                                id: enquiry._id,
                                status: e.target.value as EnquiryStatus,
                              })
                            }
                            className="rounded-lg border border-border bg-background px-2 py-1 text-xs capitalize"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadgeClass(enquiry.status)}`}
                          >
                            {enquiry.status.replace("_", " ")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="rounded-lg p-2 text-foreground hover:bg-muted"
                            aria-label="View enquiry"
                            title="View details"
                          >
                            <IconEye className="h-4 w-4" />
                          </button>
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => setDeleteId(enquiry._id)}
                              className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                              aria-label="Delete enquiry"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}

      <EnquiryDetailDialog
        enquiry={selectedEnquiry}
        open={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        statusPending={statusMutation.isPending}
        onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
        readOnly={!canUpdateStatus}
      />

      {canDelete && (
        <AlertDialog.Root open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
            <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl">
              <AlertDialog.Title className="text-lg font-semibold">Delete enquiry?</AlertDialog.Title>
              <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
                This action cannot be undone.
              </AlertDialog.Description>
              <div className="mt-6 flex justify-end gap-3">
                <AlertDialog.Cancel className="rounded-lg border border-border px-4 py-2 text-sm">
                  Cancel
                </AlertDialog.Cancel>
                <AlertDialog.Action
                  onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                  className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground"
                >
                  Delete
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </div>
  );
}
