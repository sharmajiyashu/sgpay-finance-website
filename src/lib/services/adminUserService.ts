import {
  post,
  put,
  putFormData,
  deleteRequest,
} from "@/lib/api";
import type {
  CreateAdminUserDto,
  UpdateAdminUserDto,
  GetAdminUserByIdDto,
} from "@/lib/validations/admin-role";

export interface AdminUser {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Derived or fallback
  mobile?: string;
  phoneExt?: string;
  /** Backend field */
  adminRoleId?: number | null;
  /** Normalized for UI (same as adminRoleId) */
  roleId?: number;
  /** Backend role join */
  role?: { id: number; name: string; description?: string | null } | null;
  isActive?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AdminUserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedAdminUsers {
  users: AdminUser[];
  pagination: AdminUserPagination;
}

function normalizeAdminUser(u: AdminUser): AdminUser {
  const adminRoleId =
    typeof u.adminRoleId === "number"
      ? u.adminRoleId
      : typeof (u as unknown as { adminRoleId?: unknown }).adminRoleId === "number"
        ? ((u as unknown as { adminRoleId: number }).adminRoleId as number)
        : null;

  const roleId =
    typeof u.roleId === "number"
      ? u.roleId
      : adminRoleId != null
        ? adminRoleId
        : undefined;

  return { ...u, adminRoleId, roleId };
}

/** POST /adminUser/get - Returns list of admin users. */
export async function getAdminUsers(
  body: GetAdminUserByIdDto
): Promise<PaginatedAdminUsers> {
  const raw = await post<PaginatedAdminUsers | { users?: AdminUser[]; pagination?: AdminUserPagination }>(
    "/adminUser/get",
    {
      ...body,
      page: body.page ?? 1,
      limit: body.limit ?? 10,
    }
  );

  if (raw && typeof raw === "object" && "users" in raw && Array.isArray(raw.users)) {
    const data = raw as PaginatedAdminUsers;
    return {
      ...data,
      users: data.users.map((u) => normalizeAdminUser(u)),
    };
  }

  return {
    users: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  };
}

/** POST /adminUser/create - Creates a new admin user. */
export async function createAdminUser(
  body: CreateAdminUserDto
): Promise<AdminUser> {
  const raw = await post<AdminUser | AdminUser[]>("/adminUser/create", body);
  if (Array.isArray(raw) && raw.length > 0) {
    return raw[0] as AdminUser;
  }
  if (raw && typeof raw === "object" && "id" in raw) {
    return raw as AdminUser;
  }
  throw new Error("Unexpected create user response");
}

/** PUT /adminUser/update - Updates an existing admin user. */
export async function updateAdminUser(
  body: UpdateAdminUserDto
): Promise<AdminUser> {
  return put<AdminUser>("/adminUser/update", body);
}

/** DELETE /adminUser/delete/:id - Deletes an admin user. */
export async function deleteAdminUser(id: number): Promise<void> {
  await deleteRequest<{ message?: string }>(`/adminUser/delete/${id}`);
}
