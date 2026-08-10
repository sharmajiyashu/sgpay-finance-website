import { get } from "@/sg-agent/lib/api";
import type { Enquiry } from "@/sg-admin/lib/types/enquiry";
import type { PaginationMeta } from "@/sg-admin/lib/paginated-list";

export interface EnquiriesListResponse {
  enquiries: Enquiry[];
  pagination: PaginationMeta;
}

export async function getEnquiries(url: string): Promise<EnquiriesListResponse> {
  return get<EnquiriesListResponse>(url);
}
