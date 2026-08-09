import { getAuthUser, type AuthUser } from "@/sg-admin/lib/api";

export function getPermissions(user?: AuthUser | null): Record<string, boolean> {
  const u = user ?? getAuthUser();
  const perms = u?.permissions;
  if (perms && typeof perms === "object" && !Array.isArray(perms)) {
    return perms as Record<string, boolean>;
  }
  return {};
}

export function hasPermission(featureKey: string, user?: AuthUser | null): boolean {
  const u = user ?? getAuthUser();
  const perms = getPermissions(u);
  if (perms.__super_admin === true) return true;

  const designation = typeof u?.designation === "string" ? u.designation : undefined;
  // Super admin or legacy admin session without role metadata → full access
  if (!designation || designation === "super_admin") return true;

  return perms[featureKey] === true;
}

export function hasAnyPermission(featureKeys: string[], user?: AuthUser | null): boolean {
  return featureKeys.some((key) => hasPermission(key, user));
}
