"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Select from "@radix-ui/react-select";
import {
  IconChevronDown,
  IconPlus,
  IconPencil,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconRefresh,
} from "@tabler/icons-react";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";
import {
  getSettingOptionCategories,
  listSettingOptions,
  createSettingOption,
  updateSettingOption,
  reorderSettingOptions,
  deleteSettingOption,
  type SettingOptionRow,
  type SettingOptionCategoryItem,
} from "@/lib/services/adminSettingOptionsService";
import type { SettingOptionCategory } from "@/lib/validations/admin-setting-options";
import {
  createSettingOptionSchema,
  updateSettingOptionSchema,
} from "@/lib/validations/admin-setting-options";

export default function SettingOptionsPage() {
  const { t } = useTranslations();
  const [categories, setCategories] = React.useState<SettingOptionCategoryItem[]>(
    []
  );
  const [category, setCategory] = React.useState<SettingOptionCategory | "">("");
  const [options, setOptions] = React.useState<SettingOptionRow[]>([]);
  const [includeInactive, setIncludeInactive] = React.useState(false);
  const [loadingCats, setLoadingCats] = React.useState(true);
  const [loadingOpts, setLoadingOpts] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<SettingOptionRow | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<SettingOptionRow | null>(
    null
  );
  const [reordering, setReordering] = React.useState(false);

  const loadCategories = React.useCallback(async () => {
    setLoadingCats(true);
    setError(null);
    try {
      const res = await getSettingOptionCategories();
      const list = res.categories ?? [];
      setCategories(list);
      setCategory((prev) => (prev ? prev : list[0]?.key ?? ""));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("settingOptions.failedToLoad")
      );
    } finally {
      setLoadingCats(false);
    }
  }, [t]);

  const loadOptions = React.useCallback(async () => {
    if (!category) return;
    setLoadingOpts(true);
    setError(null);
    try {
      const res = await listSettingOptions(category, {
        includeInactive,
      });
      setOptions(res.options ?? []);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("settingOptions.failedToLoad")
      );
      setOptions([]);
    } finally {
      setLoadingOpts(false);
    }
  }, [category, includeInactive, t]);

  React.useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  React.useEffect(() => {
    if (category) void loadOptions();
  }, [category, includeInactive, loadOptions]);

  async function applyReorder(next: SettingOptionRow[]) {
    if (!category || next.length === 0) return;
    setReordering(true);
    setError(null);
    try {
      const res = await reorderSettingOptions(
        category,
        next.map((o) => o.id)
      );
      setOptions(res.options ?? next);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("settingOptions.failedToLoad")
      );
      void loadOptions();
    } finally {
      setReordering(false);
    }
  }

  function moveRow(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= options.length) return;
    const next = [...options];
    const tmp = next[index];
    const swap = next[j];
    if (!tmp || !swap) return;
    next[index] = swap;
    next[j] = tmp;
    void applyReorder(next);
  }

  async function toggleActive(row: SettingOptionRow) {
    if (!category) return;
    setError(null);
    try {
      const updated = await updateSettingOption(category, row.id, {
        isActive: !row.isActive,
      });
      setOptions((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("common.updateFailed")
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("settingOptions.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("settingOptions.subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void loadCategories();
            if (category) void loadOptions();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <IconRefresh
            className={twMerge(
              "h-4 w-4",
              (loadingCats || loadingOpts) && "animate-spin"
            )}
          />
          {t("common.refresh")}
        </button>
      </div>

      {error && (
        <div
          className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="min-w-[220px] flex-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("settingOptions.category")}
          </label>
          {loadingCats ? (
            <p className="text-sm text-muted-foreground">
              {t("settingOptions.loadingCategories")}
            </p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("settingOptions.noCategories")}
            </p>
          ) : (
            <Select.Root
              value={category || undefined}
              onValueChange={(v) => setCategory(v as SettingOptionCategory)}
            >
              <Select.Trigger
                aria-label={t("settingOptions.category")}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 text-left text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Select.Value placeholder={t("settingOptions.selectCategory")} />
                <Select.Icon asChild>
                  <IconChevronDown className="h-4 w-4 opacity-50" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  className="z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
                  position="popper"
                  sideOffset={4}
                >
                  <Select.Viewport className="p-1">
                    {categories.map((c) => (
                      <Select.Item
                        key={c.key}
                        value={c.key}
                        className="relative flex cursor-default select-none items-center rounded-lg py-2 pl-3 pr-8 text-sm outline-none data-highlighted:bg-muted"
                      >
                        <Select.ItemText>
                          {c.label ?? c.key.replace(/_/g, " ")}
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          )}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          {t("settingOptions.includeInactive")}
        </label>
        <button
          type="button"
          disabled={!category}
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          <IconPlus className="h-4 w-4" />
          {t("settingOptions.addOption")}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 w-24">{t("settingOptions.sortOrder")}</th>
                <th className="px-4 py-3">{t("settingOptions.optionName")}</th>
                <th className="px-4 py-3 w-28">{t("settingOptions.isActive")}</th>
                <th className="px-4 py-3 text-right w-48">
                  {t("userManagement.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loadingOpts ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                    {t("settingOptions.loadingOptions")}
                  </td>
                </tr>
              ) : !category ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                    {t("settingOptions.selectCategory")}
                  </td>
                </tr>
              ) : options.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                    {t("settingOptions.noOptions")}
                  </td>
                </tr>
              ) : (
                options.map((row, index) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {row.sortOrder}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.name}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void toggleActive(row)}
                        className={twMerge(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          row.isActive
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {row.isActive ? t("users.yes") : t("users.no")}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          disabled={reordering || index === 0}
                          onClick={() => moveRow(index, -1)}
                          title={t("settingOptions.moveUp")}
                          className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted disabled:opacity-40"
                        >
                          <IconArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={reordering || index === options.length - 1}
                          onClick={() => moveRow(index, 1)}
                          title={t("settingOptions.moveDown")}
                          className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted disabled:opacity-40"
                        >
                          <IconArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditRow(row)}
                          title={t("common.edit")}
                          className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted"
                        >
                          <IconPencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteRow(row)}
                          title={t("common.delete")}
                          className="rounded-lg border border-destructive/30 p-2 text-destructive hover:bg-destructive/10"
                        >
                          <IconTrash className="h-4 w-4" />
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

      <OptionFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t("settingOptions.addOption")}
        category={category}
        initial={null}
        t={t}
        onSaved={() => void loadOptions()}
      />

      <OptionFormDialog
        open={!!editRow}
        onOpenChange={(o) => !o && setEditRow(null)}
        title={t("settingOptions.editOption")}
        category={category}
        initial={editRow}
        t={t}
        onSaved={() => {
          setEditRow(null);
          void loadOptions();
        }}
      />

      <AlertDialog.Root
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(420px,94vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold text-foreground">
              {t("settingOptions.deleteConfirmTitle")}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {t("settingOptions.deleteConfirmDescription")}
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <button
                  type="button"
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium"
                >
                  {t("common.cancel")}
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  type="button"
                  className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground"
                  onClick={async () => {
                    if (!deleteRow || !category) return;
                    try {
                      await deleteSettingOption(category, deleteRow.id);
                      setDeleteRow(null);
                      void loadOptions();
                    } catch (e) {
                      setError(
                        e instanceof Error
                          ? e.message
                          : t("settingOptions.failedToLoad")
                      );
                    }
                  }}
                >
                  {t("common.delete")}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}

function OptionFormDialog({
  open,
  onOpenChange,
  title,
  category,
  initial,
  t,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  category: SettingOptionCategory | "";
  initial: SettingOptionRow | null;
  t: (key: string) => string;
  onSaved: () => void;
}) {
  const [name, setName] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setFormError(null);
    if (initial) {
      setName(initial.name);
      setSortOrder(String(initial.sortOrder));
      setIsActive(initial.isActive);
    } else {
      setName("");
      setSortOrder("");
      setIsActive(true);
    }
  }, [open, initial]);

  async function handleSubmit() {
    if (!category) return;
    setFormError(null);
    if (initial) {
      const body: Record<string, unknown> = {};
      if (name.trim() !== initial.name) body.name = name.trim();
      const so = sortOrder === "" ? undefined : Number(sortOrder);
      if (so !== undefined && !Number.isNaN(so) && so !== initial.sortOrder) {
        body.sortOrder = so;
      }
      if (isActive !== initial.isActive) body.isActive = isActive;
      const parsed = updateSettingOptionSchema.safeParse(body);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? t("common.saveFailed"));
        return;
      }
      if (Object.keys(parsed.data).length === 0) {
        onOpenChange(false);
        return;
      }
      setSaving(true);
      try {
        await updateSettingOption(category, initial.id, parsed.data);
        onSaved();
        onOpenChange(false);
      } catch (e) {
        setFormError(
          e instanceof Error ? e.message : t("common.saveFailed")
        );
      } finally {
        setSaving(false);
      }
    } else {
      const so =
        sortOrder === "" ? undefined : Number(sortOrder);
      const payload = {
        name: name.trim(),
        sortOrder:
          so !== undefined && !Number.isNaN(so) ? so : undefined,
        isActive,
      };
      const parsed = createSettingOptionSchema.safeParse(payload);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? t("common.saveFailed"));
        return;
      }
      setSaving(true);
      try {
        await createSettingOption(category, parsed.data);
        onSaved();
        onOpenChange(false);
      } catch (e) {
        setFormError(
          e instanceof Error ? e.message : t("common.saveFailed")
        );
      } finally {
        setSaving(false);
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[min(480px,95vw)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-border bg-background shadow-lg"
          aria-describedby={undefined}
        >
          <div className="border-b border-border px-5 py-4">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {title}
            </Dialog.Title>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {t("settingOptions.optionName")}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                placeholder={t("settingOptions.optionNamePlaceholder")}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {t("settingOptions.sortOrder")}{" "}
                <span className="font-normal text-muted-foreground">
                  ({t("roles.descriptionOptional")})
                </span>
              </label>
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              {t("settingOptions.isActive")}
            </label>
          </div>
          <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium"
              >
                {t("common.cancel")}
              </button>
            </Dialog.Close>
            <button
              type="button"
              disabled={saving || !category}
              onClick={() => void handleSubmit()}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {saving ? t("users.saving") : t("common.save")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
