import {
  get,
  post,
  put,
  patch,
  deleteRequest,
} from "@/lib/api";
import type {
  SettingOptionCategory,
  CreateSettingOptionDto,
  UpdateSettingOptionDto,
} from "@/lib/validations/admin-setting-options";

export interface SettingOptionCategoryItem {
  key: SettingOptionCategory;
  label: string;
}

export interface SettingOptionsCategoriesResponse {
  categories: SettingOptionCategoryItem[];
}

export interface SettingOptionRow {
  id: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListSettingOptionsResponse {
  category: SettingOptionCategory;
  options: SettingOptionRow[];
}

/** GET /setting-options/categories */
export async function getSettingOptionCategories(): Promise<SettingOptionsCategoriesResponse> {
  return get<SettingOptionsCategoriesResponse>("/setting-options/categories");
}

/** GET /setting-options/:category */
export async function listSettingOptions(
  category: SettingOptionCategory,
  params?: { includeInactive?: boolean }
): Promise<ListSettingOptionsResponse> {
  return get<ListSettingOptionsResponse>(`/setting-options/${category}`, {
    params,
  });
}

/** POST /setting-options/:category */
export async function createSettingOption(
  category: SettingOptionCategory,
  body: CreateSettingOptionDto
): Promise<SettingOptionRow> {
  return post<SettingOptionRow>(`/setting-options/${category}`, body);
}

/** PUT /setting-options/:category/:id */
export async function updateSettingOption(
  category: SettingOptionCategory,
  id: number,
  body: UpdateSettingOptionDto
): Promise<SettingOptionRow> {
  return put<SettingOptionRow>(`/setting-options/${category}/${id}`, body);
}

/** PATCH /setting-options/:category/order */
export async function reorderSettingOptions(
  category: SettingOptionCategory,
  orderedIds: number[]
): Promise<ListSettingOptionsResponse> {
  return patch<ListSettingOptionsResponse>(
    `/setting-options/${category}/order`,
    { orderedIds }
  );
}

/** DELETE /setting-options/:category/:id */
export async function deleteSettingOption(
  category: SettingOptionCategory,
  id: number
): Promise<{ deleted: boolean; id: number }> {
  return deleteRequest<{ deleted: boolean; id: number }>(
    `/setting-options/${category}/${id}`
  );
}
