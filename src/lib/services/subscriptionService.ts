import {
  get,
} from "@/lib/api";
import type {
  GetSubscriptionsFilterDto,
} from "@/lib/validations/package";

export interface Subscription {
  id: string;
  userId: number;
  packageId: string;
  transactionId?: string;
  receiptData?: string;
  provider?: string;
  platform?: string;
  originalTransactionId?: string;
  purchaseToken?: string;
  productId?: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  package?: {
    id: string;
    tier: string;
    price: number;
    currency: string;
  };
}

export interface SubscriptionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedSubscriptions {
  subscriptions: Subscription[];
  pagination: SubscriptionPagination;
}

/** GET /subscriptions/user-packages - Returns list of user subscriptions. */
export async function getSubscriptions(
  params: GetSubscriptionsFilterDto
): Promise<PaginatedSubscriptions> {
  const raw = await get<PaginatedSubscriptions>("/subscriptions/user-packages", { params });
  
  if (raw && typeof raw === "object" && "subscriptions" in raw) {
    return raw;
  }

  return {
    subscriptions: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  };
}

/** GET /subscriptions/user-packages/:id - Detailed view of a subscription. */
export async function getSubscriptionDetail(id: string): Promise<Subscription> {
  return get<Subscription>(`/subscriptions/user-packages/${id}`);
}
