"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Select from "@radix-ui/react-select";
import { IconChevronDown } from "@tabler/icons-react";
import {
  getAdminPackages,
  createAdminPackage,
  updateAdminPackage,
  deleteAdminPackage,
  type PremiumPackage,
  type PackagePagination,
} from "@/lib/services/adminPackageService";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";
import { Pagination } from "@/components/ui/Pagination";
import { createPackageSchema } from "@/lib/validations/package";

function PackageFormDialog({
  open,
  onOpenChange,
  title,
  initial,
  onSave,
  t,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  initial: Partial<PremiumPackage>;
  onSave: (body: any) => Promise<void>;
  t: (key: string) => string;
}) {
  const [formData, setFormData] = React.useState({
    id: initial.id || "",
    tier: initial.tier || "PREMIUM",
    androidPlanId: initial.androidPlanId || "",
    iosPlanId: initial.iosPlanId || "",
    price: initial.price || 0,
    currency: initial.currency || "USD",
    duration: initial.duration || 30,
    orderIdx: initial.orderIdx || 0,
    status: initial.status || "ACTIVE",
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setFormData({
      id: initial.id || "",
      tier: initial.tier || "PREMIUM",
      androidPlanId: initial.androidPlanId || "",
      iosPlanId: initial.iosPlanId || "",
      price: Number(initial.price) || 0,
      currency: initial.currency || "USD",
      duration: initial.duration || 30,
      orderIdx: initial.orderIdx || 0,
      status: initial.status || "ACTIVE",
    });
    setError(null);
  }, [open, initial]);

  const isEdit = !!initial.id;

  async function handleSubmit() {
    setError(null);
    const parsed = createPackageSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("common.saveFailed"));
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[min(540px,95vw)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-border bg-background shadow-lg"
          aria-describedby={undefined}
        >
          <div className="shrink-0 border-b border-border px-4 py-3 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                {title}
              </Dialog.Title>
              <Dialog.Close className="shrink-0 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                {t("common.close")}
              </Dialog.Close>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">{t("packages.id")}</label>
                <input
                  type="text"
                  disabled={isEdit}
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  placeholder="e.g. premium_monthly"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">{t("packages.tier")}</label>
                  <input
                    type="text"
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. PREMIUM"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">{t("packages.status")}</label>
                  <Select.Root
                    value={formData.status}
                    onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                  >
                    <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-left text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <Select.Value />
                      <Select.Icon asChild><IconChevronDown className="h-4 w-4 opacity-50" /></Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="relative z-100 min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border bg-background shadow-lg" position="popper" sideOffset={4}>
                        <Select.Viewport className="p-1">
                          {["ACTIVE", "INACTIVE"].map((s) => (
                            <Select.Item key={s} value={s} className="relative flex cursor-default select-none items-center rounded-md py-2 pl-3 pr-8 text-sm outline-none data-highlighted:bg-primary/15 data-highlighted:text-primary">
                              <Select.ItemText>{s}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">{t("packages.price")}</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">{t("packages.duration")}</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">{t("packages.androidPlanId")}</label>
                <input
                  type="text"
                  value={formData.androidPlanId}
                  onChange={(e) => setFormData({ ...formData, androidPlanId: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">{t("packages.iosPlanId")}</label>
                <input
                  type="text"
                  value={formData.iosPlanId}
                  onChange={(e) => setFormData({ ...formData, iosPlanId: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">{t("packages.orderIdx")}</label>
                <input
                  type="number"
                  value={formData.orderIdx}
                  onChange={(e) => setFormData({ ...formData, orderIdx: Number(e.target.value) })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="button"
                disabled={saving}
                onClick={handleSubmit}
                className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {saving ? t("packages.saving") : t("common.save")}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function PackagesPage() {
  const { t } = useTranslations();
  const [packages, setPackages] = React.useState<PremiumPackage[]>([]);
  const [pagination, setPagination] = React.useState<PackagePagination>({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editPackage, setEditPackage] = React.useState<PremiumPackage | null>(null);
  const [deletePackageId, setDeletePackageId] = React.useState<string | null>(null);

  const refresh = React.useCallback(async (page = pagination.page) => {
    setError(null);
    setLoading(true);
    try {
      const data = await getAdminPackages({ page, limit: pagination.limit });
      setPackages(data.packages);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("packages.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t, pagination.page, pagination.limit]);

  React.useEffect(() => { refresh(); }, [refresh]);

  async function handleCreate(body: any) {
    await createAdminPackage(body);
    refresh();
  }

  async function handleUpdate(body: any) {
    if (editPackage) {
      await updateAdminPackage(editPackage.id, body);
      refresh();
    }
  }

  async function handleDelete() {
    if (deletePackageId) {
      await deleteAdminPackage(deletePackageId);
      setDeletePackageId(null);
      refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("packages.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("packages.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            {t("common.refresh")}
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {t("packages.createPackage")}
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">{t("packages.id")}</th>
              <th className="px-4 py-3 font-medium">{t("packages.tier")}</th>
              <th className="px-4 py-3 font-medium">{t("packages.price")}</th>
              <th className="px-4 py-3 font-medium">{t("packages.duration")}</th>
              <th className="px-4 py-3 font-medium">{t("packages.status")}</th>
              <th className="px-4 py-3 font-medium">{t("roles.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">{t("packages.loadingPackages")}</td></tr>
            ) : packages.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">{t("packages.noPackagesFound")}</td></tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{pkg.id}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{pkg.tier}</span></td>
                  <td className="px-4 py-3 font-medium">{pkg.currency} {pkg.price}</td>
                  <td className="px-4 py-3">{pkg.duration} days</td>
                  <td className="px-4 py-3">
                    <span className={twMerge("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", pkg.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditPackage(pkg)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors">{t("common.edit")}</button>
                      <button onClick={() => setDeletePackageId(pkg.id)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors">{t("common.delete")}</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      <PackageFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t("packages.createPackageTitle")}
        initial={{}}
        onSave={handleCreate}
        t={t}
      />

      {editPackage && (
        <PackageFormDialog
          open={!!editPackage}
          onOpenChange={(v) => !v && setEditPackage(null)}
          title={t("packages.editPackageTitle")}
          initial={editPackage}
          onSave={handleUpdate}
          t={t}
        />
      )}

      <AlertDialog.Root open={!!deletePackageId} onOpenChange={(o) => !o && setDeletePackageId(null)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(440px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold text-foreground">{t("packages.deleteConfirmTitle")}</AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {t("packages.deleteConfirmDescription")} <span className="font-medium text-foreground">{deletePackageId}</span>.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">{t("common.cancel")}</AlertDialog.Cancel>
              <AlertDialog.Action onClick={handleDelete} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90">{t("common.delete")}</AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
