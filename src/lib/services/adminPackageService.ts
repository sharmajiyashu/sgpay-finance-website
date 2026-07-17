import {
  post,
  put,
  deleteRequest,
  get,
} from "@/lib/api";
import type {
  CreatePackageDto,
  UpdatePackageDto,
  GetPackagesFilterDto,
} from "@/lib/validations/package";

export interface PremiumPackage {
  id: string;
  tier: string;
  androidPlanId: string;
  iosPlanId: string;
  price: number | string;
  currency: string;
  duration: number;
  features: Record<string, any>;
  orderIdx: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface PackagePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedPackages {
  packages: PremiumPackage[];
  pagination: PackagePagination;
}

/** GET /packages - Returns list of premium packages. */
export async function getAdminPackages(
  params: GetPackagesFilterDto
): Promise<PaginatedPackages> {
  const raw = await get<PaginatedPackages>("/packages", { params });
  
  if (raw && typeof raw === "object" && "packages" in raw) {
    return raw;
  }

  return {
    packages: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  };
}

/** POST /packages - Creates a new premium package. */
export async function createAdminPackage(
  body: CreatePackageDto
): Promise<{ package: PremiumPackage; message: string }> {
  return post<{ package: PremiumPackage; message: string }>("/packages", body);
}

/** PUT /packages/:id - Updates an existing premium package. */
export async function updateAdminPackage(
  id: string,
  body: UpdatePackageDto
): Promise<{ package: PremiumPackage; message: string }> {
  return put<{ package: PremiumPackage; message: string }>(`/packages/${id}`, body);
}

/** DELETE /packages/:id - Deletes a premium package. */
export async function deleteAdminPackage(id: string): Promise<{ message: string }> {
  return deleteRequest<{ message: string }>(`/packages/${id}`);
}
