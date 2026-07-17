import {
  get,
  put,
  deleteRequest,
} from "@/lib/api";
import type {
  GetEnquiriesFilterDto,
  UpdateEnquiryStatusDto,
} from "@/lib/validations/enquiry";

export interface Enquiry {
  id: number;
  userId: number;
  type: "general" | "technical_support" | "billing" | "complaint" | "feedback" | "other";
  message: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    mobile: string | null;
  };
}

export interface EnquiryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedEnquiries {
  enquiries: Enquiry[];
  pagination: EnquiryPagination;
}

/** GET /enquiries - Returns list of user enquiries. */
export async function getEnquiries(
  params: GetEnquiriesFilterDto
): Promise<PaginatedEnquiries> {
  const raw = await get<PaginatedEnquiries>("/enquiries", { params });
  
  if (raw && typeof raw === "object" && "enquiries" in raw) {
    return raw;
  }

  return {
    enquiries: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  };
}

/** GET /enquiries/:id - Detailed view of an enquiry. */
export async function getEnquiryDetail(id: number): Promise<Enquiry> {
  return get<Enquiry>(`/enquiries/${id}`);
}

/** PUT /enquiries/:id/status - Updates enquiry status. */
export async function updateEnquiryStatus(
  id: number,
  body: UpdateEnquiryStatusDto
): Promise<{ enquiry: Enquiry; message: string }> {
  return put<{ enquiry: Enquiry; message: string }>(`/enquiries/${id}/status`, body);
}

/** DELETE /enquiries/:id - Deletes an enquiry. */
export async function deleteEnquiry(id: number): Promise<{ message: string }> {
  return deleteRequest<{ message: string }>(`/enquiries/${id}`);
}
