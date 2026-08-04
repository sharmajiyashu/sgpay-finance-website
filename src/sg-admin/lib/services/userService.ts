import { get, patch } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type { AppUser } from "@/sg-admin/lib/types/user";
import type { PaginationMeta } from "@/sg-admin/lib/paginated-list";

export interface UsersListResponse {
  users: AppUser[];
  pagination: PaginationMeta;
}

export async function getUsers(url: string): Promise<UsersListResponse> {
  return get<UsersListResponse>(url);
}

export async function updateUserActive(
  id: string,
  isActive: boolean
): Promise<AppUser> {
  return patch<AppUser>(ADMIN_API_PATHS.userById(id), { isActive });
}
