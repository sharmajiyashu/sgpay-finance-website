import { get, post, put, deleteRequest } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type { Enquiry, EnquiryStatus } from "@/sg-admin/lib/types/enquiry";
import type { PaginationMeta } from "@/sg-admin/lib/paginated-list";

export interface EnquiriesListResponse {
  enquiries: Enquiry[];
  pagination: PaginationMeta;
}

export async function getEnquiries(url: string): Promise<EnquiriesListResponse> {
  return get<EnquiriesListResponse>(url);
}

export async function createAdminRoarEnquiry(body: {
  name: string;
  email: string;
  phone?: string;
}): Promise<{ enquiry: Enquiry; applyUrl: string }> {
  return post<{ enquiry: Enquiry; applyUrl: string }>(ADMIN_API_PATHS.enquiries, body);
}

export async function getEnquiryById(id: string): Promise<Enquiry> {
  return get<Enquiry>(ADMIN_API_PATHS.enquiryById(id));
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<Enquiry> {
  return put<Enquiry>(ADMIN_API_PATHS.enquiryStatus(id), { status });
}

export async function deleteEnquiry(id: string): Promise<void> {
  await deleteRequest<null>(ADMIN_API_PATHS.enquiryById(id));
}
