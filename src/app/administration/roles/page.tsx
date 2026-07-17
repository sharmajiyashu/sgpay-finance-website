"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  createAdminRole,
  deleteAdminRole,
  getAdminRolePermissions,
  getAdminRoles,
  updateAdminRole,
  type PermissionModule,
  type AdminRole,
  type AdminRolePagination,
} from "@/lib/services/adminRoleService";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "@/contexts/LanguageContext";
import { getLocalizedText } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { Pagination } from "@/components/ui/Pagination";

function normalizeRolesResponse(
  raw: AdminRole | AdminRole[]
): AdminRole[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "id" in raw) return [raw as AdminRole];
  return [];
}

function mergePermissions(
  template: PermissionModule[],
  current: PermissionModule[]
): PermissionModule[] {
  if (template.length === 0) return current;
  const currentByName = new Map(current.map((m) => [m.moduleName, m]));
  return template.map((t) => {
    const c = currentByName.get(t.moduleName);
    const mergedFeatures: PermissionModule["features"] = { ...t.features };
    if (c?.features) {
      for (const [featureKey, featureVal] of Object.entries(c.features)) {
        if (mergedFeatures[featureKey]) {
          mergedFeatures[featureKey] = {
            ...mergedFeatures[featureKey],
            enabled: Boolean(featureVal?.enabled),
          };
        } else {
          mergedFeatures[featureKey] = {
            enabled: Boolean(featureVal?.enabled),
            description:
              featureVal?.description ?? featureKey,
          };
        }
      }
    }
    return {
      moduleName: t.moduleName,
      enabled: Boolean(c?.enabled ?? t.enabled),
      features: mergedFeatures,
    };
  });
}

function buildEmptyPermissionsFromTemplate(
  template: PermissionModule[]
): PermissionModule[] {
  return template.map((m) => ({
    ...m,
    enabled: false,
    features: Object.fromEntries(
      Object.entries(m.features ?? {}).map(([k, v]) => [
        k,
        { ...v, enabled: false },
      ])
    ),
  }));
}

function getRolePermissions(role: AdminRole): PermissionModule[] {
  const raw = role.permissions ?? [];
  return Array.isArray(raw) ? raw : [];
}

function fmtDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function countEnabledFeatures(mods: PermissionModule[]) {
  let n = 0;
  for (const m of mods) {
    for (const f of Object.values(m.features ?? {})) if (f?.enabled) n++;
  }
  return n;
}

function PermissionEditor({
  value,
  onChange,
  readOnly,
  locale,
  t,
}: {
  value: PermissionModule[];
  onChange?: (next: PermissionModule[]) => void;
  readOnly?: boolean;
  locale: Locale;
  t: (key: string) => string;
}) {
  function updateModule(idx: number, next: PermissionModule) {
    if (!onChange) return;
    const copy = value.slice();
    copy[idx] = next;
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      {value.map((m, idx) => {
        const features = Object.entries(m.features ?? {});
        const moduleKey = m.moduleName || `module-${idx}`;
        return (
          <div
            key={moduleKey}
            className="min-w-0 rounded-lg border border-border bg-background p-3 sm:p-4"
          >
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">
                  {getLocalizedText(m.moduleName, locale)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {countEnabledFeatures([m])} {t("roles.enabledFeatures")}
                </div>
              </div>
              <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={m.enabled}
                  disabled={readOnly}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    const nextFeatures = Object.fromEntries(
                      Object.entries(m.features ?? {}).map(([k, v]) => [
                        k,
                        { ...v, enabled },
                      ])
                    );
                    updateModule(idx, {
                      ...m,
                      enabled,
                      features: nextFeatures,
                    });
                  }}
                  className="h-4 w-4 rounded border-input accent-primary"
                  aria-label={`Toggle module ${getLocalizedText(m.moduleName, locale)}`}
                />
                {t("roles.moduleEnabled")}
              </label>
            </div>
            <div className="mt-4 space-y-2">
              {features.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  {t("roles.noFeatures")}
                </div>
              ) : (
                features.map(([featureKey, feature]) => {
                  const disabled = readOnly || !m.enabled;
                  return (
                    <div
                      key={featureKey}
                      className={twMerge(
                        "flex min-w-0 flex-col gap-2 rounded-md border border-border px-3 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
                        disabled && "opacity-70"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-foreground">
                          {featureKey}
                        </div>
                        <div className="line-clamp-2 text-xs text-muted-foreground sm:line-clamp-none">
                          {getLocalizedText(feature?.description, locale)}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(feature?.enabled)}
                        disabled={disabled}
                        onChange={(e) => {
                          const enabled = e.target.checked;
                          updateModule(idx, {
                            ...m,
                            features: {
                              ...m.features,
                              [featureKey]: {
                                ...feature,
                                enabled,
                              },
                            },
                          });
                        }}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-input accent-primary"
                        aria-label={`Toggle ${featureKey}`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RoleFormDialog({
  open,
  onOpenChange,
  title,
  templatePermissions,
  initial,
  onSave,
  t,
  locale,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  templatePermissions: PermissionModule[];
  initial: {
    id?: number;
    name: string;
    description: string;
    permissions: PermissionModule[];
  };
  onSave: (body: {
    id?: number;
    name: string;
    description: string;
    permissions: PermissionModule[];
  }) => Promise<void>;
  t: (key: string) => string;
  locale: Locale;
}) {
  const [name, setName] = React.useState(initial.name);
  const [description, setDescription] = React.useState(initial.description);
  const [permissions, setPermissions] = React.useState<PermissionModule[]>(
    initial.permissions
  );
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setName(initial.name);
    setDescription(initial.description);
    setPermissions(initial.permissions);
    setError(null);
  }, [open, initial]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[min(900px,95vw)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-lg sm:p-6"
          aria-describedby={undefined}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                {title}
              </Dialog.Title>
              <Dialog.Description
                id="role-form-desc"
                className="text-sm text-muted-foreground"
              >
                {t("roles.setRolePermissions")}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="shrink-0 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={t("common.close")}
            >
              {t("common.close")}
            </Dialog.Close>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="min-w-0 space-y-4">
              <div>
                <label
                  htmlFor="role-name"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  {t("roles.roleName")}
                </label>
                <input
                  id="role-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder={t("roles.roleNamePlaceholder")}
                />
              </div>
              <div>
                <label
                  htmlFor="role-desc"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  {t("roles.description")}
                </label>
                <textarea
                  id="role-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder={t("roles.descriptionOptional")}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  setError(null);
                  const trimmed = name.trim();
                  if (!trimmed) {
                    setError(t("roles.roleNameRequired"));
                    return;
                  }
                  if (templatePermissions.length === 0) {
                    setError(t("roles.templateNotLoaded"));
                    return;
                  }
                  setSaving(true);
                  try {
                    await onSave({
                      id: initial.id,
                      name: trimmed,
                      description: description.trim(),
                      permissions,
                    });
                    onOpenChange(false);
                  } catch (e) {
                    setError(
                      e instanceof Error ? e.message : t("common.saveFailed")
                    );
                  } finally {
                    setSaving(false);
                  }
                }}
                className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? t("roles.saving") : t("common.save")}
              </button>
            </div>
            <div className="min-w-0 overflow-auto rounded-lg border border-border bg-muted/20 p-3 sm:max-h-[50vh] lg:max-h-[60vh]">
              <div className="mb-3 text-sm font-semibold text-foreground">
                {t("roles.permissions")}
              </div>
              <PermissionEditor
                value={permissions}
                onChange={setPermissions}
                locale={locale}
                t={t}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function RolesPage() {
  const { t, locale } = useTranslations();
  const [roles, setRoles] = React.useState<AdminRole[]>([]);
  const [pagination, setPagination] = React.useState<AdminRolePagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [permissionsTemplate, setPermissionsTemplate] = React.useState<
    PermissionModule[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [viewRole, setViewRole] = React.useState<AdminRole | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editRole, setEditRole] = React.useState<AdminRole | null>(null);
  const [deleteRole, setDeleteRole] = React.useState<AdminRole | null>(null);

  const refresh = React.useCallback(async (page = pagination.page) => {
    setLoadError(null);
    setLoading(true);
    try {
      const [rolesData, template] = await Promise.all([
        getAdminRoles({ page, limit: pagination.limit }),
        getAdminRolePermissions(),
      ]);
      setRoles(rolesData.roles);
      setPagination(rolesData.pagination);
      setPermissionsTemplate(Array.isArray(template) ? template : []);
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : t("roles.failedToLoad")
      );
    } finally {
      setLoading(false);
    }
  }, [t, pagination.page, pagination.limit]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const baseTemplate = permissionsTemplate;
  const emptyPerms =
    baseTemplate.length > 0
      ? buildEmptyPermissionsFromTemplate(baseTemplate)
      : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("roles.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("roles.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {t("common.refresh")}
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
          >
            {t("roles.createRole")}
          </button>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive" role="alert">
          {loadError}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium align-middle">{t("roles.name")}</th>
              <th className="px-4 py-3 font-medium align-middle whitespace-nowrap">{t("roles.enabledFeaturesCount")}</th>
              <th className="px-4 py-3 font-medium align-middle whitespace-nowrap">{t("roles.updated")}</th>
              <th className="px-4 py-3 font-medium align-middle whitespace-nowrap" scope="col">
                {t("roles.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  className="px-4 py-6 text-muted-foreground align-middle"
                  colSpan={4}
                >
                  {t("roles.loadingRoles")}
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-muted-foreground align-middle"
                  colSpan={4}
                >
                  {t("roles.noRolesFound")}
                </td>
              </tr>
            ) : (
              roles.map((role) => {
                const perms = getRolePermissions(role);
                return (
                  <tr
                    key={role.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 align-middle">
                      <span className="font-medium text-foreground">
                        {getLocalizedText(role.name, locale) || "—"}
                      </span>
                      {role.description && (
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {getLocalizedText(role.description, locale)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground align-middle whitespace-nowrap">
                      {countEnabledFeatures(perms)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground align-middle whitespace-nowrap">
                      {fmtDate(role.updatedAt as string)}
                    </td>
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex flex-wrap justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => setViewRole(role)}
                          className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {t("roles.viewPermissions")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditRole(role);
                            setEditOpen(true);
                          }}
                          className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {t("common.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteRole(role)}
                          className="rounded-lg border border-border px-3 py-2 text-xs text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {t("common.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => void refresh(p)}
          total={pagination.total}
          limit={pagination.limit}
        />
      )}

      {/* View permissions dialog */}
      <Dialog.Root
        open={!!viewRole}
        onOpenChange={(o) => !o && setViewRole(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-[min(900px,95vw)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-lg"
            aria-describedby={undefined}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {getLocalizedText(viewRole?.name, locale) || t("roles.thisRole")} {t("roles.viewRolePermissions")}
                </Dialog.Title>
                <Dialog.Description
                  id="view-role-desc"
                  className="text-sm text-muted-foreground"
                >
                  {t("roles.viewRoleDescription")}
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={t("common.close")}
              >
                {t("common.close")}
              </Dialog.Close>
            </div>
            <div className="mt-6 max-h-[70vh] overflow-auto rounded-lg border border-border bg-muted/20 p-3">
              <PermissionEditor
                value={mergePermissions(
                  permissionsTemplate,
                  getRolePermissions(viewRole ?? ({} as AdminRole))
                )}
                readOnly
                locale={locale}
                t={t}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Create role dialog */}
      <RoleFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t("roles.createRoleTitle")}
        templatePermissions={permissionsTemplate}
        t={t}
        locale={locale}
        initial={{
          name: "",
          description: "",
          permissions: emptyPerms,
        }}
        onSave={async (body) => {
          await createAdminRole({
            name: body.name,
            description: body.description,
            permissions: body.permissions,
          });
          await refresh();
        }}
      />

      {/* Edit role dialog */}
      {editRole && (
        <RoleFormDialog
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setEditRole(null);
          }}
          title={t("roles.editRoleTitle")}
          templatePermissions={permissionsTemplate}
          t={t}
          locale={locale}
          initial={{
            id: editRole.id,
            name: editRole.name || "",
            description: String(editRole.description || ""),
            permissions: mergePermissions(
              permissionsTemplate,
              getRolePermissions(editRole)
            ),
          }}
          onSave={async (body) => {
            const adminRoleId = Number(body.id);
            if (!Number.isFinite(adminRoleId))
              throw new Error("Invalid role id");
            await updateAdminRole({
              adminRoleId,
              name: body.name,
              description: body.description,
              permissions: body.permissions,
            });
            await refresh();
          }}
        />
      )}

      {/* Delete confirm */}
      <AlertDialog.Root
        open={!!deleteRole}
        onOpenChange={(o) => !o && setDeleteRole(null)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(520px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold text-foreground">
              {t("roles.deleteConfirmTitle")}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {t("roles.deleteConfirmDescription")}{" "}
              <span className="font-medium text-foreground">
                {getLocalizedText(deleteRole?.name, locale) || t("roles.thisRole")}
              </span>
              .
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                {t("common.cancel")}
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={async () => {
                  const r = deleteRole;
                  setDeleteRole(null);
                  if (!r) return;
                  await deleteAdminRole({ adminRoleId: r.id });
                  await refresh(pagination.page);
                }}
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
