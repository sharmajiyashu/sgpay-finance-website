"use client";

import * as React from "react";
import Link from "next/link";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { IconSearch, IconFilter, IconRefresh, IconEye, IconTrash, IconCalendar, IconUsers, IconUserCheck, IconUserPlus, IconCreditCard, IconUser } from "@tabler/icons-react";
import {
  getAppUsers,
  deleteAppUser,
  deleteAppUsers,
  type AppUser,
  type UserPagination,
} from "@/lib/services/userManagementService";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";
import { Pagination } from "@/components/ui/Pagination";

export default function UserManagementPage() {
  const { t } = useTranslations();
  const [users, setUsers] = React.useState<AppUser[]>([]);
  const [pagination, setPagination] = React.useState<UserPagination>({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false);

  const refresh = React.useCallback(async (page = pagination.page) => {
    setError(null);
    setLoading(true);
    try {
      const data = await getAppUsers({
        page,
        limit: pagination.limit,
        search: search || undefined
      });
      setUsers(data.users);
      setPagination(data.pagination);
      setSelectedIds([]); // Reset selection when data changes/refreshes
    } catch (e) {
      setError(e instanceof Error ? e.message : t("userManagement.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t, pagination.limit, search]);

  React.useEffect(() => {
    const timer = setTimeout(() => refresh(1), 500);
    return () => clearTimeout(timer);
  }, [search]); // Refresh on search change with debounce

  async function handleDelete() {
    if (deleteId) {
      try {
        await deleteAppUser(deleteId);
        setDeleteId(null);
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : t("common.deleteFailed"));
      }
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length > 0) {
      try {
        await deleteAppUsers(selectedIds);
        setConfirmBulkDelete(false);
        setSelectedIds([]);
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : t("common.deleteFailed"));
      }
    }
  }

  const isAllSelected = users.length > 0 && users.every(user => selectedIds.includes(user.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !users.some(user => user.id === id)));
    } else {
      setSelectedIds(prev => {
        const newIds = [...prev];
        users.forEach(user => {
          if (!newIds.includes(user.id)) newIds.push(user.id);
        });
        return newIds;
      });
    }
  };

  const handleSelectUser = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("userManagement.title")}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{t("userManagement.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refresh()}
            className="group flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 shadow-sm"
          >
            <IconRefresh className={twMerge("h-4.5 w-4.5 transition-transform duration-500", loading && "animate-spin")} />
            {t("common.refresh")}
          </button>
        </div>
      </div>


      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            placeholder={t("userManagement.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 shadow-sm"
          />
        </div>
        
        {selectedIds.length > 0 && (
          <button
            onClick={() => setConfirmBulkDelete(true)}
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border border-destructive/25 bg-destructive/10 px-6 text-sm font-bold text-destructive transition-all hover:bg-destructive hover:text-white active:scale-95 shadow-sm animate-in fade-in zoom-in-95 duration-200"
          >
            <IconTrash className="h-5 w-5" />
            Delete Selected ({selectedIds.length})
          </button>
        )}

        <button className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 text-sm font-bold text-muted-foreground transition-all hover:bg-muted active:scale-95 shadow-sm">
          <IconFilter className="h-5 w-5" />
          {t("common.filter")}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-bold text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70">
              <tr>
                <th className="px-8 py-5 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary/20 cursor-pointer"
                  />
                </th>
                <th className="px-8 py-5">{t("userManagement.firstName")}</th>
                <th className="px-8 py-5">{t("userManagement.email")}</th>
                <th className="px-8 py-5">{t("userManagement.mobile")}</th>
                <th className="px-8 py-5">{t("userManagement.createdAt")}</th>
                <th className="px-8 py-5 text-right">{t("userManagement.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-background/50">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative h-12 w-12 text-primary">
                        <IconRefresh className="h-full w-full animate-spin opacity-20" />
                        <IconUser className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground">{t("userManagement.loading")}</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <IconUsers className="h-12 w-12" />
                      <p className="text-sm font-bold">{t("userManagement.noUsers")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id} className="group hover:bg-muted/30 transition-all duration-300">
                    <td className="px-8 py-5 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                          <span className="text-sm font-black">{user.firstName?.[0] || "?"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            #{user.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-medium text-muted-foreground">{user.email || "—"}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                        {user.mobile || "—"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 font-medium text-muted-foreground">
                        <IconCalendar className="h-4 w-4 opacity-40" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Link
                          href={`/user-management/${user.id}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:bg-primary hover:border-primary hover:text-white shadow-sm"
                          title={t("userManagement.viewDetail")}
                        >
                          <IconEye className="h-5 w-5" stroke={2} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(user.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:bg-destructive hover:border-destructive hover:text-white shadow-sm"
                          title={t("userManagement.deleteUser")}
                        >
                          <IconTrash className="h-5 w-5" stroke={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => refresh(p)}
          total={pagination.total}
          limit={pagination.limit}
        />
      )}

      <AlertDialog.Root open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(400px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl animate-in zoom-in-95">
            <AlertDialog.Title className="text-lg font-bold text-foreground">
              {t("userManagement.deleteConfirmTitle")}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("userManagement.deleteConfirmDescription")}
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <AlertDialog.Cancel className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted active:scale-95">
                {t("common.cancel")}
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={handleDelete}
                className="rounded-xl bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-destructive/20"
              >
                {t("common.delete")}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <AlertDialog.Root open={confirmBulkDelete} onOpenChange={(o) => !o && setConfirmBulkDelete(false)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(400px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl animate-in zoom-in-95">
            <AlertDialog.Title className="text-lg font-bold text-foreground">
              Delete Selected Users?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to permanently remove the {selectedIds.length} selected users and all their associated data? This action cannot be undone.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <AlertDialog.Cancel className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted active:scale-95">
                {t("common.cancel")}
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={handleBulkDelete}
                className="rounded-xl bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-destructive/20"
              >
                {t("common.delete")}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
