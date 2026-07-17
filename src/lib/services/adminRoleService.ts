import { get, post, put, deleteRequest } from "@/lib/api";
import type {
  CreateAdminUserRoleDto,
  UpdateAdminUserRoleDto,
  DeleteAdminUserRoleDto,
} from "@/lib/validations/admin-role";

export interface PermissionFeature {
  enabled: boolean;
  description: string | { en: string; kh: string };
}

export interface PermissionModule {
  moduleName: string;
  enabled: boolean;
  features: Record<string, PermissionFeature>;
}

export interface AdminRole {
  id: number;
  name: string;
  description?: string;
  permissions?: PermissionModule[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AdminRolePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedAdminRoles {
  roles: AdminRole[];
  pagination: AdminRolePagination;
}

function toNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizePaginatedRoles(
  raw: unknown,
  fallbackPage: number,
  fallbackLimit: number
): PaginatedAdminRoles {
  if (!raw || typeof raw !== "object") {
    return {
      roles: [],
      pagination: {
        page: fallbackPage,
        limit: fallbackLimit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  const data = raw as Record<string, unknown>;
  const roles = Array.isArray(data.roles)
    ? (data.roles as AdminRole[])
    : Array.isArray(data.items)
      ? (data.items as AdminRole[])
      : Array.isArray(data.data)
        ? (data.data as AdminRole[])
        : [];

  const p = (data.pagination ?? data.meta ?? {}) as Record<string, unknown>;
  const page = toNumber(p.page ?? data.page, fallbackPage);
  const limit = toNumber(p.limit ?? data.limit, fallbackLimit);
  const total = toNumber(p.total ?? data.total, roles.length);
  const totalPages = toNumber(
    p.totalPages ?? data.totalPages,
    limit > 0 ? Math.ceil(total / limit) : 0
  );

  return {
    roles,
    pagination: { page, limit, total, totalPages },
  };
}

/** GET /role/permissions - Returns list of permission modules. */
export async function getAdminRolePermissions(): Promise<PermissionModule[]> {
  return get<PermissionModule[]>("/role/permissions");
}

/** GET /role/get - Returns all admin roles. */
export async function getAdminRoles(params?: { page?: number; limit?: number }): Promise<PaginatedAdminRoles> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const query = `?page=${page}&limit=${limit}`;
  const raw = await get<unknown>(`/role/get${query}`);
  return normalizePaginatedRoles(raw, page, limit);
}

/** POST /role/create - Creates a new admin role. */
export async function createAdminRole(
  body: CreateAdminUserRoleDto
): Promise<AdminRole> {
  return post<AdminRole>("/role/create", body);
}

/** PUT /role/update - Updates an existing admin role. */
export async function updateAdminRole(
  body: UpdateAdminUserRoleDto
): Promise<AdminRole> {
  return put<AdminRole>("/role/update", body);
}

/** DELETE /role/delete - Deletes an admin role. Body: { adminRoleId }. */
export async function deleteAdminRole(
  body: DeleteAdminUserRoleDto
): Promise<void> {
  await deleteRequest<void>("/role/delete", { data: body });
}
