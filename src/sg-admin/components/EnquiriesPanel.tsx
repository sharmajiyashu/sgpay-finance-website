"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { listUrl, unwrapList } from "@/sg-admin/lib/paginated-list";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import {
  deleteEnquiry,
  getEnquiries,
  updateEnquiryStatus,
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

const STATUS_OPTIONS: { value: EnquiryStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

interface EnquiriesPanelProps {
  categoryId?: string;
}

export function EnquiriesPanel({ categoryId }: EnquiriesPanelProps) {
  const queryClient = useQueryClient();
  const category = categoryId ? getEnquiryCategory(categoryId) : undefined;

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(categoryId ?? "");
  const [serviceFilter, setServiceFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const serviceOptions = useMemo(() => {
    if (typeFilter) return getServicesForCategory(typeFilter);
    return ENQUIRY_CATEGORIES.flatMap((c) => c.services);
  }, [typeFilter]);

  const url = listUrl(ADMIN_API_PATHS.enquiries, page, searchQuery, 20, {
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    service: serviceFilter || undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-enquiries", page, searchQuery, statusFilter, typeFilter, serviceFilter],
    queryFn: () => getEnquiries(url),
  });

  const { items: enquiries, pagination } = unwrapList<Enquiry>(
    data as Record<string, unknown> | undefined,
    "enquiries"
  );

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) =>
      updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEnquiry(id),
    onSuccess: () => {
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Enquiry deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const stats = getEnquiryCatalogStats();
  const title = category ? `${category.label} Enquiries` : "All Enquiries";
  const subtitle = category
    ? `${category.services.length} service types in ${category.label}`
    : `${stats.categories} categories · ${stats.servicePages} enquiry sources`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search name, email, message..."
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
                enquiries.map((enquiry) => (
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
                      {getServiceLabel(enquiry.type, enquiry.service)}
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="line-clamp-3 text-muted-foreground">{enquiry.message}</p>
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDeleteId(enquiry._id)}
                        className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                        aria-label="Delete enquiry"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
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

      <AlertDialog.Root open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl">
            <AlertDialog.Title className="text-lg font-semibold">Delete enquiry?</AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <AlertDialog.Cancel className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</AlertDialog.Cancel>
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
    </div>
  );
}
