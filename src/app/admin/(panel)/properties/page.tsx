"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import { listUrl, unwrapList } from "@/sg-admin/lib/paginated-list";
import {
  deleteProperty,
  getProperties,
} from "@/sg-admin/lib/services/propertyService";
import type { AdminProperty } from "@/sg-admin/lib/types/property";
import { hasPermission } from "@/sg-admin/lib/permissions";
import { Pagination } from "@/components/ui/Pagination";
import {
  RecordCard,
  RecordCardActions,
  RecordCardField,
  RecordCardFields,
  RecordCardHeader,
  ResponsiveRecordList,
} from "@/components/ui/ResponsiveRecordList";
import { PropertyAccessGuard } from "@/sg-admin/components/PropertyAccessGuard";

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient();
  const canCreate = hasPermission("admin:property:create");
  const canUpdate = hasPermission("admin:property:update");
  const canDelete = hasPermission("admin:property:delete");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const url = listUrl(ADMIN_API_PATHS.properties, page, debouncedSearch, pageSize);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-properties", url],
    queryFn: () => getProperties(url),
  });

  const { items: properties, pagination } = unwrapList<AdminProperty>(
    data as Record<string, unknown> | undefined,
    "properties"
  );

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Property deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <PropertyAccessGuard>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Properties</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage real estate listings shown on the public website
            </p>
          </div>
          {canCreate && (
            <Link
              href="/admin/properties/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <IconPlus size={16} />
              Add property
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm"
            />
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load properties"}
          </p>
        )}

        <ResponsiveRecordList
          isLoading={isLoading}
          isEmpty={!isLoading && properties.length === 0}
          loadingMessage="Loading properties..."
          emptyMessage="No properties yet. Add one from the admin panel."
          table={
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Published</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => {
                  const id = p._id || p.id || "";
                  return (
                    <tr key={id} className="border-b border-border/60">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.city || "—"}</td>
                      <td className="px-4 py-3">
                        {p.projectType}
                        {p.propertyType ? ` / ${p.propertyType}` : ""}
                      </td>
                      <td className="px-4 py-3">{p.status || "—"}</td>
                      <td className="px-4 py-3">{p.isPublished ? "Yes" : "No"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {canUpdate && (
                            <Link href={`/admin/properties/${id}`} className="text-primary hover:underline">
                              Edit
                            </Link>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="text-destructive hover:underline"
                              onClick={() => {
                                if (confirm(`Delete ${p.name}?`)) deleteMutation.mutate(id);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          }
          cards={properties.map((p) => {
            const id = p._id || p.id || "";
            return (
              <RecordCard key={id}>
                <RecordCardHeader title={p.name} subtitle={p.city || p.location} />
                <RecordCardFields>
                  <RecordCardField label="Type" value={`${p.projectType}${p.propertyType ? ` / ${p.propertyType}` : ""}`} />
                  <RecordCardField label="Status" value={p.status || "—"} />
                  <RecordCardField label="Published" value={p.isPublished ? "Yes" : "No"} />
                </RecordCardFields>
                <RecordCardActions>
                  {canUpdate && (
                    <Link href={`/admin/properties/${id}`} className="text-sm text-primary">
                      Edit
                    </Link>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm text-destructive"
                      onClick={() => {
                        if (confirm(`Delete ${p.name}?`)) deleteMutation.mutate(id);
                      }}
                    >
                      <IconTrash size={14} /> Delete
                    </button>
                  )}
                </RecordCardActions>
              </RecordCard>
            );
          })}
        />

        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={setPage}
          />
        )}
      </div>
    </PropertyAccessGuard>
  );
}
