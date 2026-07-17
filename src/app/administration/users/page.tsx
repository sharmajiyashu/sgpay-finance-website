"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Select from "@radix-ui/react-select";
import { IconChevronDown, IconEye, IconEyeOff } from "@tabler/icons-react";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
  type AdminUser,
  type AdminUserPagination,
} from "@/lib/services/adminUserService";
import { getAdminRoles, type AdminRole } from "@/lib/services/adminRoleService";
import { useTranslations } from "@/contexts/LanguageContext";
import { getLocalizedText } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { createAdminUserSchema } from "@/lib/validations/admin-role";
import { Pagination } from "@/components/ui/Pagination";

function normalizeRolesResponse(raw: AdminRole | AdminRole[]): AdminRole[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "id" in raw) return [raw as AdminRole];
  return [];
}

function fmtDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function AdminUserFormDialog({
  open,
  onOpenChange,
  title,
  description,
  initial,
  roles,
  onSave,
  t,
  locale,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  initial: {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roleId: number | "";
    isActive: boolean;
  };
  roles: AdminRole[];
  onSave: (body: {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    roleId: number;
    isActive: boolean;
  }) => Promise<void>;
  t: (key: string) => string;
  locale: Locale;
}) {
  const [email, setEmail] = React.useState(initial.email);
  const [firstName, setFirstName] = React.useState(initial.firstName);
  const [lastName, setLastName] = React.useState(initial.lastName);
  const [password, setPassword] = React.useState(initial.password);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [roleId, setRoleId] = React.useState<number | "">(initial.roleId);
  const [isActive, setIsActive] = React.useState(initial.isActive);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setEmail(initial.email);
    setFirstName(initial.firstName);
    setLastName(initial.lastName);
    setPassword(initial.password);
    setConfirmPassword("");
    setRoleId(initial.roleId);
    setIsActive(initial.isActive);
    setError(null);
  }, [open, initial]);

  const isEdit = initial.id != null;

  const passwordsMatch = password === confirmPassword;
  const hasPasswordInput = password.trim() !== "" || confirmPassword.trim() !== "";
  const canSave =
    email.trim() !== "" &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    roleId !== "" &&
    (isEdit ? (hasPasswordInput ? passwordsMatch : true) : password.trim() !== "" && passwordsMatch);

  async function handleSubmit() {
    setError(null);
    const trimmedEmail = email.trim();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    if (!trimmedEmail) {
      setError(t("users.emailRequired"));
      return;
    }
    if (!trimmedFirst) {
      setError(t("users.firstNameRequired") || "First name is required");
      return;
    }
    if (!trimmedLast) {
      setError(t("users.lastNameRequired") || "Last name is required");
      return;
    }
    if (!isEdit && !password.trim()) {
      setError(t("users.passwordRequired"));
      return;
    }
    if (!isEdit && password !== confirmPassword) {
      setError(t("users.passwordsMustMatch"));
      return;
    }
    if (isEdit && hasPasswordInput && password !== confirmPassword) {
      setError(t("users.passwordsMustMatch"));
      return;
    }
    if (roleId === "") {
      setError(t("users.roleRequired"));
      return;
    }

    if (!isEdit) {
      const parsed = createAdminUserSchema.safeParse({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        password,
        roleId: Number(roleId),
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? t("common.saveFailed"));
        return;
      }
    }

    setSaving(true);
    try {
      await onSave({
        id: initial.id,
        email: trimmedEmail,
        firstName: trimmedFirst,
        lastName: trimmedLast,
        password: password.trim() || undefined,
        roleId: Number(roleId),
        isActive,
      });
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
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[min(480px,95vw)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-border bg-background shadow-lg"
          aria-describedby={undefined}
        >
          <div className="shrink-0 border-b border-border px-4 py-3 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {title}
                </Dialog.Title>
                <Dialog.Description
                  id="user-form-desc"
                  className="mt-0.5 text-sm text-muted-foreground"
                >
                  {description}
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="shrink-0 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={t("common.close")}
              >
                {t("common.close")}
              </Dialog.Close>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="user-email" className="mb-1 block text-sm font-medium text-foreground">
                  {t("users.email")}
                </label>
                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="mb-1 block text-sm font-medium text-foreground">
                    {t("users.firstName") || "First Name"}
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder={t("users.firstNamePlaceholder") || "First name"}
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="mb-1 block text-sm font-medium text-foreground">
                    {t("users.lastName") || "Last Name"}
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder={t("users.lastNamePlaceholder") || "Last name"}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="user-password" className="mb-1 block text-sm font-medium text-foreground">
                  {t("auth.password")} {isEdit && `(${t("users.passwordLeaveBlank")})`}
                </label>
                <div className="relative">
                  <input
                    id="user-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder={isEdit ? "••••••••" : t("auth.passwordPlaceholder")}
                    autoComplete={isEdit ? "new-password" : "off"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  >
                    {showPassword ? (
                      <IconEyeOff className="h-4 w-4" aria-hidden />
                    ) : (
                      <IconEye className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="user-confirm-password" className="mb-1 block text-sm font-medium text-foreground">
                  {t("users.confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    id="user-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder={t("users.confirmPassword")}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff className="h-4 w-4" aria-hidden />
                    ) : (
                      <IconEye className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
                {hasPasswordInput && !passwordsMatch && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {t("users.passwordsMustMatch")}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="user-role" className="mb-1 block text-sm font-medium text-foreground">
                  {t("users.role")}
                </label>
                <Select.Root
                  value={roleId === "" ? undefined : String(roleId)}
                  onValueChange={(v) => setRoleId(v === undefined || v === "" ? "" : Number(v))}
                >
                  <Select.Trigger
                    id="user-role"
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-left text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    aria-label={t("users.role")}
                  >
                    <Select.Value placeholder={t("users.selectRole")} />
                    <Select.Icon asChild>
                      <IconChevronDown className="h-4 w-4 opacity-50" aria-hidden />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="relative z-100 max-h-[min(var(--radix-select-content-available-height,300px),300px)] min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border bg-background shadow-lg"
                      position="popper"
                      sideOffset={4}
                    >
                      <Select.Viewport className="p-1">
                        {roles.map((r) => (
                          <Select.Item
                            key={r.id}
                            value={String(r.id)}
                            className="relative flex cursor-default select-none items-center rounded-md py-2 pl-3 pr-8 text-sm outline-none data-highlighted:bg-primary/15 data-highlighted:text-primary data-[state=checked]:bg-primary/15 data-[state=checked]:text-primary"
                          >
                            <Select.ItemText>
                              {getLocalizedText(r.name, locale) || String(r.id)}
                            </Select.ItemText>
                            <Select.ItemIndicator className="absolute right-2 flex items-center">
                              ✓
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                {t("common.active")}
              </label>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={saving || !canSave}
                onClick={() => void handleSubmit()}
                className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? t("users.saving") : t("common.save")}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function UsersPage() {
  const { t, locale } = useTranslations();
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [pagination, setPagination] = React.useState<AdminUserPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [roles, setRoles] = React.useState<AdminRole[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editUser, setEditUser] = React.useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = React.useState<AdminUser | null>(null);
  const [searchInput, setSearchInput] = React.useState("");

  const refresh = React.useCallback(async (page = pagination.page) => {
    setLoadError(null);
    setLoading(true);
    try {
      const [usersData, rolesRaw] = await Promise.all([
        getAdminUsers({ page, limit: pagination.limit }),
        getAdminRoles(),
      ]);
      setUsers(usersData.users);
      setPagination(usersData.pagination);
      setRoles(normalizeRolesResponse(rolesRaw.roles));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : t("users.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t, pagination.page, pagination.limit]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const searchLower = searchInput.trim().toLowerCase();
  const filteredUsers =
    searchLower === ""
      ? users
      : users.filter(
        (u) =>
          (u.email ?? "").toLowerCase().includes(searchLower) ||
          (u.firstName ?? "").toLowerCase().includes(searchLower) ||
          (u.lastName ?? "").toLowerCase().includes(searchLower)
      );

  const roleById = React.useMemo(() => {
    const m = new Map<number, AdminRole>();
    for (const r of roles) m.set(r.id, r);
    return m;
  }, [roles]);

  async function handleCreate(body: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    roleId: number;
    isActive: boolean;
  }) {
    await createAdminUser({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password!,
      roleId: body.roleId,
      role: "admin",
      isActive: body.isActive,
    });
    await refresh();
  }

  async function handleUpdate(body: {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    roleId: number;
    isActive: boolean;
  }) {
    const id = body.id;
    if (id == null) throw new Error("User id required");
    await updateAdminUser({
      id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      ...(body.password ? { password: body.password } : {}),
      ...(body.roleId != null ? { roleId: body.roleId } : {}),
      status: body.isActive ? "active" : "inactive",
      isActive: body.isActive,
    });
    await refresh();
  }

  async function handleToggleActive(user: AdminUser, isActive: boolean) {
    const previous = user.isActive !== false;
    setUsers((prev) =>
      prev.map((x) => (x.id === user.id ? { ...x, isActive } : x))
    );
    setLoadError(null);
    try {
      await updateAdminUser({
        id: user.id,
        status: isActive ? "active" : "inactive",
        isActive,
      });
    } catch (e) {
      setUsers((prev) =>
        prev.map((x) => (x.id === user.id ? { ...x, isActive: previous } : x))
      );
      setLoadError(e instanceof Error ? e.message : t("common.saveFailed"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("users.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("users.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder={t("users.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="min-w-[180px] rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={t("users.searchPlaceholder")}
          />
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
            {t("users.createUser")}
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
              <th className="px-4 py-3 font-medium align-middle">{t("users.email")}</th>
              <th className="px-4 py-3 font-medium align-middle">{t("users.name")}</th>
              <th className="px-4 py-3 font-medium align-middle">{t("users.role")}</th>
              <th className="px-4 py-3 font-medium align-middle">{t("common.active")}</th>
              <th className="px-4 py-3 font-medium align-middle whitespace-nowrap">{t("users.updated")}</th>
              <th className="px-4 py-3 font-medium align-middle" scope="col">
                {t("roles.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground align-middle" colSpan={6}>
                  {t("users.loadingUsers")}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground align-middle" colSpan={6}>
                  {t("users.noUsersFound")}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const role =
                  user.role ??
                  (user.roleId != null ? roleById.get(user.roleId) : undefined);
                const displayName = user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.lastName || user.name || "—";
                return (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 align-middle text-foreground">
                      {user.email ?? "—"}
                    </td>
                    <td className="px-4 py-3 align-middle text-foreground">
                      {displayName}
                    </td>
                    <td className="px-4 py-3 align-middle text-muted-foreground">
                      {role ? (role.name ?? "—") : "—"}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={user.isActive !== false && user.status !== "inactive"}
                          onChange={(e) => void handleToggleActive(user, e.target.checked)}
                          className="h-4 w-4 rounded border-input accent-primary"
                          aria-label={
                            user.isActive !== false ? t("users.deactivate") : t("users.activate")
                          }
                        />
                        <span className="text-muted-foreground">
                          {user.isActive !== false && user.status !== "inactive" ? t("users.yes") : t("users.no")}
                        </span>
                      </label>
                    </td>
                    <td className="px-4 py-3 align-middle text-muted-foreground whitespace-nowrap">
                      {fmtDate(user.updatedAt as string)}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex flex-wrap justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditUser(user);
                            setEditOpen(true);
                          }}
                          className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {t("common.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteUser(user)}
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

      <AdminUserFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t("users.createUserTitle")}
        description={t("users.createUserDescription")}
        initial={{
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          roleId: "",
          isActive: true,
        }}
        roles={roles}
        onSave={handleCreate}
        t={t}
        locale={locale}
      />

      {editUser && (
        <AdminUserFormDialog
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setEditUser(null);
          }}
          title={t("users.editUserTitle")}
          description={t("users.editUserDescription")}
          initial={{
            id: editUser.id,
            email: editUser.email ?? "",
            firstName: editUser.firstName ?? "",
            lastName: editUser.lastName ?? "",
            password: "",
            roleId: editUser.roleId ?? editUser.adminRoleId ?? "",
            isActive: editUser.isActive !== false && editUser.status !== "inactive",
          }}
          roles={roles}
          onSave={handleUpdate}
          t={t}
          locale={locale}
        />
      )}

      <AlertDialog.Root
        open={!!deleteUser}
        onOpenChange={(o) => !o && setDeleteUser(null)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(440px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold text-foreground">
              {t("users.deleteConfirmTitle")}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {t("users.deleteConfirmDescription")}{" "}
              <span className="font-medium text-foreground">
                {deleteUser?.email ?? t("users.thisUser")}
              </span>
              {t("users.deleteConfirmSuffix")}
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                {t("common.cancel")}
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={async () => {
                  const u = deleteUser;
                  setDeleteUser(null);
                  if (!u) return;
                  await deleteAdminUser(u.id);
                  setUsers((prev) => prev.filter((x) => x.id !== u.id));
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
