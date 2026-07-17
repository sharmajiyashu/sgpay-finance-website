import { get, put, deleteRequest } from "@/lib/api";

export interface AccountDeletionRequest {
  id: number;
  userId: number;
  reasonId: number;
  customReason: string | null;
  status: "pending" | "approved" | "rejected" | "completed";
  requestedAt: string;
  processedAt: string | null;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string | null;
  };
  reason: {
    id: number;
    reason: string;
  };
}

export interface AccountDeletionFilters {
  search?: string;
  status?: string;
  reasonId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface AccountDeletionResponse {
  requests: AccountDeletionRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAccountDeletionRequests(filters: AccountDeletionFilters = {}) {
  return get<AccountDeletionResponse>("/account-deletions", {
    params: filters,
  });
}

export async function updateAccountDeletionStatus(
  id: number,
  payload: { status: AccountDeletionRequest["status"] }
) {
  return put(`/account-deletions/${id}/status`, payload);
}

export async function deleteAccountDeletionRequest(id: number) {
  return deleteRequest(`/account-deletions/${id}`);
}
