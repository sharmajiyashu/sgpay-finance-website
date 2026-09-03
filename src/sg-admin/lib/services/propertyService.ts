import { get, patch, post, postForm, deleteRequest } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type { PaginationMeta } from "@/sg-admin/lib/paginated-list";
import type { AdminProperty, PropertyWritePayload } from "@/sg-admin/lib/types/property";

export interface PropertiesListResponse {
  properties: AdminProperty[];
  pagination: PaginationMeta;
}

export async function getProperties(url: string): Promise<PropertiesListResponse> {
  const data = await get<PropertiesListResponse | AdminProperty[]>(url);
  if (Array.isArray(data)) {
    return {
      properties: data,
      pagination: { page: 1, limit: data.length || 20, total: data.length, totalPages: 1 },
    };
  }
  return {
    properties: data.properties || [],
    pagination: data.pagination ?? {
      page: 1,
      limit: 20,
      total: data.properties?.length || 0,
      totalPages: 1,
    },
  };
}

export async function getPropertyById(id: string): Promise<AdminProperty> {
  const data = await get<{ property: AdminProperty } | AdminProperty>(ADMIN_API_PATHS.propertyById(id));
  if (data && typeof data === "object" && "property" in data && data.property) {
    return data.property;
  }
  return data as AdminProperty;
}

export async function createProperty(body: PropertyWritePayload): Promise<AdminProperty> {
  const data = await post<{ property: AdminProperty } | AdminProperty>(ADMIN_API_PATHS.properties, body);
  if (data && typeof data === "object" && "property" in data && data.property) {
    return data.property;
  }
  return data as AdminProperty;
}

export async function updateProperty(id: string, body: Partial<AdminProperty>): Promise<AdminProperty> {
  const data = await patch<{ property: AdminProperty } | AdminProperty>(
    ADMIN_API_PATHS.propertyById(id),
    body
  );
  if (data && typeof data === "object" && "property" in data && data.property) {
    return data.property;
  }
  return data as AdminProperty;
}

export async function deleteProperty(id: string): Promise<void> {
  await deleteRequest(ADMIN_API_PATHS.propertyById(id));
}

export interface PropertyMediaUploadResult {
  images: string[];
  videos: string[];
  floorPlans: string[];
  builderLogo: string;
  masterPlan: string;
}

export async function uploadPropertyMedia(formData: FormData): Promise<PropertyMediaUploadResult> {
  const data = await postForm<PropertyMediaUploadResult>(ADMIN_API_PATHS.propertyMedia, formData);
  return {
    images: data.images || [],
    videos: data.videos || [],
    floorPlans: data.floorPlans || [],
    builderLogo: data.builderLogo || "",
    masterPlan: data.masterPlan || "",
  };
}
