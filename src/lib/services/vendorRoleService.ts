import { get, post, put, deleteRequest } from "@/lib/api";
import type {
  CreateVendorRoleDto,
  UpdateVendorRoleDto,
  GetVendorRolesDto,
  DeleteVendorRoleDto,
} from "@/lib/validations/vendor-role";

export interface PermissionFeatureDescription {
  en: string;
  kh: string;
}

export interface PermissionFeature {
  enabled: boolean;
  description: PermissionFeatureDescription;
}

export interface PermissionModule {
  moduleName: string;
  enabled: boolean;
  features: Record<string, PermissionFeature>;
}

export interface VendorRole {
  id: number;
  name?: string;
  description?: string;
  clinicId?: number;
  permissions?: PermissionModule[];
  [key: string]: unknown;
}

/** Permission module shape returned by GET /role/permissions (no auth). */
export type PermissionModuleList = PermissionModule[];

/** POST /role/create – requires permission vendor:role:create */
export async function createVendorRole(
  body: CreateVendorRoleDto
): Promise<VendorRole> {
  const raw = await post<VendorRole | VendorRole[]>("/role/create", body);
  if (Array.isArray(raw) && raw.length > 0) return raw[0] as VendorRole;
  if (raw && typeof raw === "object" && "id" in raw) return raw as VendorRole;
  throw new Error("Unexpected create role response");
}

/** PUT /role/update – requires permission vendor:role:update */
export async function updateVendorRole(
  body: UpdateVendorRoleDto
): Promise<VendorRole> {
  const raw = await put<VendorRole | VendorRole[]>("/role/update", body);
  if (Array.isArray(raw) && raw.length > 0) return raw[0] as VendorRole;
  if (raw && typeof raw === "object" && "id" in raw) return raw as VendorRole;
  throw new Error("Unexpected update role response");
}

/** DELETE /role/delete – requires permission vendor:role:delete. Body: { roleId, clinicId }. */
export async function deleteVendorRole(
  body: DeleteVendorRoleDto
): Promise<void> {
  await deleteRequest<{ message?: string }>("/role/delete", { data: body });
}

/** POST /role/get – requires permission vendor:role:get. Returns one role or array. */
export async function getVendorRoles(
  body: GetVendorRolesDto
): Promise<VendorRole | VendorRole[]> {
  const raw = await post<VendorRole | VendorRole[]>("/role/get", body);
  return raw;
}

/** GET /role/permissions – public, no auth. Returns list of permission modules. */
export async function getVendorPermissions(): Promise<PermissionModuleList> {
  return get<PermissionModuleList>("/role/permissions");
}
