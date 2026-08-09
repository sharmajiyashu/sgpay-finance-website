import { get, patch, post } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";

export interface AdminRole {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  permissions?: Array<{
    moduleName: string;
    enabled: boolean;
    features: Record<string, { enabled: boolean; description?: unknown }>;
  }>;
  flatPermissions?: Record<string, boolean>;
}

export async function getRoles(): Promise<{ roles: AdminRole[] }> {
  return get<{ roles: AdminRole[] }>(ADMIN_API_PATHS.roles);
}

export async function getPermissionCatalog(): Promise<{ catalog: AdminRole["permissions"] }> {
  return get<{ catalog: AdminRole["permissions"] }>(ADMIN_API_PATHS.permissionsCatalog);
}

export async function createRole(body: {
  name: string;
  description?: string;
  permissions?: AdminRole["permissions"];
}): Promise<AdminRole> {
  return post<AdminRole>(ADMIN_API_PATHS.roles, body);
}

export async function updateRole(
  id: string,
  body: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    permissions: AdminRole["permissions"];
  }>
): Promise<AdminRole> {
  return patch<AdminRole>(ADMIN_API_PATHS.roleById(id), body);
}
