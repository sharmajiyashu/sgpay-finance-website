import { get, post } from "@/sg-agent/lib/api";
import { AGENT_API_PATHS } from "@/lib/config/env";
import type { Enquiry } from "@/sg-admin/lib/types/enquiry";
import type { PaginationMeta } from "@/sg-admin/lib/paginated-list";

export interface EnquiriesListResponse {
  enquiries: Enquiry[];
  pagination: PaginationMeta;
}

export async function getEnquiries(url: string): Promise<EnquiriesListResponse> {
  return get<EnquiriesListResponse>(url);
}

export async function createAgentRoarEnquiry(body: {
  name: string;
  email: string;
  phone?: string;
}): Promise<{ enquiry: Enquiry; applyUrl: string }> {
  return post<{ enquiry: Enquiry; applyUrl: string }>(AGENT_API_PATHS.enquiries, body);
}
