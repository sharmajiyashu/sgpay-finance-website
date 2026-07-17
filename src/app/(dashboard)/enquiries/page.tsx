"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Select from "@radix-ui/react-select";
import { 
  IconSearch, 
  IconFilter, 
  IconRefresh, 
  IconTrash, 
  IconCalendar, 
  IconChevronDown, 
  IconCheck, 
  IconMail, 
  IconUser,
  IconClock
} from "@tabler/icons-react";
import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  type Enquiry,
  type EnquiryPagination,
} from "@/lib/services/enquiryService";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";
import { Pagination } from "@/components/ui/Pagination";

export default function EnquiriesPage() {
  const { t } = useTranslations();
  const [enquiries, setEnquiries] = React.useState<Enquiry[]>([]);
  const [pagination, setPagination] = React.useState<EnquiryPagination>({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const refresh = React.useCallback(async (page = pagination.page) => {
    setError(null);
    setLoading(true);
    try {
      const data = await getEnquiries({ 
        page, 
        limit: pagination.limit,
        search: search || undefined
      });
      setEnquiries(data.enquiries);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("enquiries.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t, pagination.page, pagination.limit, search]);

  React.useEffect(() => {
    const timer = setTimeout(() => refresh(1), 500);
    return () => clearTimeout(timer);
  }, [search]);

  async function handleStatusUpdate(id: number, status: Enquiry["status"]) {
    try {
      await updateEnquiryStatus(id, { status });
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.updateFailed"));
    }
  }

  async function handleDelete() {
    if (deleteId) {
      try {
        await deleteEnquiry(deleteId);
        setDeleteId(null);
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : t("common.deleteFailed"));
      }
    }
  }

  const statusColors = {
    pending: "bg-orange-500/10 text-orange-500",
    in_progress: "bg-blue-500/10 text-blue-500",
    resolved: "bg-emerald-500/10 text-emerald-500",
    closed: "bg-slate-500/10 text-slate-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("enquiries.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("enquiries.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
          >
            <IconRefresh className={twMerge("h-4 w-4", loading && "animate-spin")} />
            {t("common.refresh")}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:flex sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder={t("userManagement.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted active:scale-95">
          <IconFilter className="h-4 w-4" />
          {t("common.filter")}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">{t("enquiries.userName")}</th>
                <th className="px-6 py-4 font-semibold">{t("enquiries.type")}</th>
                <th className="px-6 py-4 font-semibold">{t("enquiries.message")}</th>
                <th className="px-6 py-4 font-semibold">{t("enquiries.status")}</th>
                <th className="px-6 py-4 font-semibold">{t("enquiries.createdAt")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("enquiries.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {loading && enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <IconRefresh className="h-8 w-8 animate-spin opacity-20" />
                      {t("enquiries.loading")}
                    </div>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {t("enquiries.noEnquiries")}
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                          {enquiry.user?.firstName?.[0] || <IconUser className="h-4 w-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{enquiry.user?.firstName} {enquiry.user?.lastName}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{enquiry.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {t(`enquiries.type.${enquiry.type}` as any)}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="line-clamp-2 text-muted-foreground leading-relaxed">
                        {enquiry.message}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Select.Root 
                        value={enquiry.status} 
                        onValueChange={(val) => handleStatusUpdate(enquiry.id, val as Enquiry["status"])}
                      >
                        <Select.Trigger className={twMerge(
                          "flex items-center justify-between gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none transition-all hover:opacity-80 active:scale-95",
                          statusColors[enquiry.status]
                        )}>
                          <Select.Value />
                          <Select.Icon>
                            <IconChevronDown className="h-3 w-3" />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="z-[100] overflow-hidden rounded-xl border border-border bg-background shadow-xl animate-in fade-in zoom-in-95">
                            <Select.Viewport className="p-1">
                              {["pending", "in_progress", "resolved", "closed"].map((status) => (
                                <Select.Item
                                  key={status}
                                  value={status}
                                  className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground outline-none transition-all hover:bg-muted hover:text-foreground data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                                >
                                  <Select.ItemText>{t(`enquiries.status.${status}` as any)}</Select.ItemText>
                                  <Select.ItemIndicator>
                                    <IconCheck className="h-3 w-3" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IconCalendar className="h-3.5 w-3.5" />
                        <span className="text-xs">
                          {new Date(enquiry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setDeleteId(enquiry.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:bg-muted hover:text-destructive"
                          title={t("enquiries.deleteEnquiry")}
                        >
                          <IconTrash className="h-4.5 w-4.5" />
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
              {t("enquiries.deleteConfirmTitle")}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("enquiries.deleteConfirmDescription")}
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
    </div>
  );
}
