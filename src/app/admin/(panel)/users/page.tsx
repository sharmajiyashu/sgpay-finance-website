"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { listUrl, unwrapList } from "@/sg-admin/lib/paginated-list";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import { getUsers, updateUserActive } from "@/sg-admin/lib/services/userService";
import type { AppUser } from "@/sg-admin/lib/types/user";
import { Pagination } from "@/components/ui/Pagination";

function userLabel(user: AppUser): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.name || user.email || user.mobile || "—";
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const url = listUrl(ADMIN_API_PATHS.users, page, searchQuery, 20, {
    isActive: activeFilter || undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users", page, searchQuery, activeFilter],
    queryFn: () => getUsers(url),
  });

  const { items: users, pagination } = unwrapList<AppUser>(
    data as Record<string, unknown> | undefined,
    "users"
  );

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUserActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage registered app users
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by name, email, business..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load users"}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Mobile</th>
                <th className="px-4 py-3 font-medium">Verified</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium">{userLabel(user)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.mobile ? `+${user.extension ?? ""}${user.mobile}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={twMerge(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          user.isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        )}
                      >
                        {user.isVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={toggleMutation.isPending}
                        onClick={() =>
                          toggleMutation.mutate({
                            id: user._id,
                            isActive: !user.isActive,
                          })
                        }
                        className={twMerge(
                          "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                          user.isActive !== false
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        )}
                      >
                        {user.isActive !== false ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
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
    </div>
  );
}
